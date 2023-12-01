import "dotenv/config";
import path from "path";
import axios from "axios";
import fs from "fs/promises";
import { v2 as compose } from "docker-compose";
import SpeculosTransportHttp from "@ledgerhq/hw-transport-node-speculos-http";
import { ENV, NanoApp } from "./types";

const { API_PORT } = process.env as ENV;
const cwd = path.join(__dirname);
const delay = (timing: number) => new Promise(resolve => setTimeout(resolve, timing));

export const spawnSpeculos = async ({
  nanoApp,
}: {
  nanoApp: NanoApp;
}): Promise<SpeculosTransportHttp> => {
  const { data: blob } = await axios({
    url: `https://raw.githubusercontent.com/LedgerHQ/coin-apps/master/nanos/${nanoApp.firmware}/Ethereum/app_${nanoApp.version}.elf`,
    method: "GET",
    responseType: "stream",
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
    },
  });
  await fs.mkdir(path.resolve("./tmp"), { recursive: true });
  await fs.writeFile(path.resolve("./tmp/app.elf"), blob, "binary");
  await compose.upAll({ cwd, log: true });

  const checkSpeculosLogs = async (): Promise<SpeculosTransportHttp> => {
    const { out } = await compose.logs("speculos");

    if (out.includes("Running on all addresses (0.0.0.0)")) {
      console.log("SPECULOS READY ✅");
      return SpeculosTransportHttp.open({
        apiPort: API_PORT,
      });
    }
    await delay(200);
    return checkSpeculosLogs();
  };
  const checkAnvilLogs = async (): Promise<void> => {
    const { out } = await compose.logs("anvil");

    if (out.includes("Listening on 0.0.0.0:")) {
      console.log("ANVIL READY ✅");
      return;
    }
    await delay(200);
    return checkAnvilLogs();
  };
  return Promise.all([checkSpeculosLogs(), checkAnvilLogs()]).then(([transport]) => transport);
};

["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException"].map(e =>
  process.on(e, async () => {
    await compose.stopMany({ cwd, log: true }, "speculos", "anvil");
    await compose.rm({ cwd, log: true });
  }),
);
