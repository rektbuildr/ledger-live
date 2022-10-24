import {
  openTransportReplayer,
  RecordStore,
} from "@ledgerhq/hw-transport-mocker";
import Btc from "../src/Btc";

test("transaction on btc – nano s 1.3.1 – native segwit", async () => {
  const transport = await openTransportReplayer(
    RecordStore.fromString(`
    => b001000000
    <= 6d00
    => e04000001505800000548000000080000000000000010000001b
    <= 41042e00ef5ab04c270bf697e817c5fd433aa4509b063745d6f82c2157a59d59c1b7146956cee1b5ce1c7739a87fb59de3ad918872b14301af3f00b538934837b1382231354a707a787578426b6358384576465a6e6d4d736a74664771314d676e6d465356b9b92151a60d39e94e5be7a91003d0f43f03cafd69db00ebc60a65434d83e66d9000
    => e0440002050100000001
    <= 9000
    => e04480022e02fc4fd606567a2146ec33fd3904d978167d8309b510071b276734768397aa4eee01000000ef8b01000000000000
    <= 9000
    => e044800204ffffffff
    <= 9000
    => e04aff001505800000548000000080000000000000010000001c
    <= 9000
    => e04a00003202a086010000000000160014562b254f8890788f45c7cf7bd4c81bce789ffcd0bd0400000000000016001483efa2f7154106
    <= 009000
    => e04a80000d6369afcfc98b829886b6c76bf5
    <= 00009000
    => e0440080050100000001
    <= 9000
    => e04480802e02fc4fd606567a2146ec33fd3904d978167d8309b510071b276734768397aa4eee01000000ef8b01000000000019
    <= 9000
    => e04480801d76a9142f3fa4710983519e4ae45dd80e72e70b79f25c5e88acffffffff
    <= 9000
    => e04800001b05800000548000000080000000000000010000001b000000000001
    <= 3045022100e4acf0eb3803a62399f53825d86aa30743fe999eefb01522d5f7ecd9eeec663d022063b90c512e207c2ac47d8759e1c73c6abeff58daec31c48905193470bc87f2d3019000
        `)
  );
  // This test covers the old bitcoin Nano app 1.6 API, before the breaking changes that occurred in v2.1.0 of the app
  const btc = new Btc({ transport, currency: "oldbitcoin" });
  const tx1 = btc.splitTransaction(
    "01000000000102b91a5eb409e1243dcc02440ad5709d57047946309a515902ffdba8b98ad9e9970000000000ffffff00b91a5eb409e1243dcc02440ad5709d57047946309a515902ffdba8b98ad9e9970100000000ffffff000250c300000000000016001449df9e8ba7e25dd4830579cb42fbea938497168bef8b0100000000001600142f3fa4710983519e4ae45dd80e72e70b79f25c5e0248304502210080ed332c269ae7d86fac26a143afcec0a634e1098fd1ee5ca43cbe0c66de861802204c804eceb4cc9ca397156fa683f46274d22bb5d95f8c8293dc595934899f7927012103cc39edf09d462b4de30cc9bf96b163f18dcee742e0a1ea6fad0274ae0b9d60330247304402203e277d48d19a01c33b45b8f102479eb10811d20991bbf060cab4ba79f0972e61022041e13ed7da2b266d20c36b01694f2d16cf144c1ff66863f26d7c332dc220bc1301210369f216ec068fb7ef17a46ad3ad4d7f0e04e8a3a16ae2da852d6e4b57c3bb972f00000000",
    true
  );
  const result = await btc.createPaymentTransaction({
    inputs: [[tx1, 1, undefined, 0xffffffff]],
    associatedKeysets: ["84'/0'/0'/1/27"],
    changePath: "84'/0'/0'/1/28",
    outputScriptHex:
      "02a086010000000000160014562b254f8890788f45c7cf7bd4c81bce789ffcd0bd0400000000000016001483efa2f71541066369afcfc98b829886b6c76bf5",
    sigHashType: 1,
    segwit: true,
    additionals: ["bitcoin", "bech32"],
  });
  expect(result).toEqual(
    "01000000000101fc4fd606567a2146ec33fd3904d978167d8309b510071b276734768397aa4eee0100000000ffffffff02a086010000000000160014562b254f8890788f45c7cf7bd4c81bce789ffcd0bd0400000000000016001483efa2f71541066369afcfc98b829886b6c76bf502483045022100e4acf0eb3803a62399f53825d86aa30743fe999eefb01522d5f7ecd9eeec663d022063b90c512e207c2ac47d8759e1c73c6abeff58daec31c48905193470bc87f2d30121022e00ef5ab04c270bf697e817c5fd433aa4509b063745d6f82c2157a59d59c1b700000000"
  );
});

test("transaction on btc – nano s 1.6.0 – native segwit", async () => {
  const transport = await openTransportReplayer(
    RecordStore.fromString(`
    => b001000000
    <= 0107426974636f696e05312e342e3201029000
    => e042000009000000010100000002
    <= 9000
    => e042800025b91a5eb409e1243dcc02440ad5709d57047946309a515902ffdba8b98ad9e9970000000000
    <= 9000
    => e042800004ffffff00
    <= 9000
    => e042800025b91a5eb409e1243dcc02440ad5709d57047946309a515902ffdba8b98ad9e9970100000000
    <= 9000
    => e042800004ffffff00
    <= 9000
    => e04280000102
    <= 9000
    => e04280001f50c300000000000016001449df9e8ba7e25dd4830579cb42fbea938497168b
    <= 9000
    => e04280001fef8b0100000000001600142f3fa4710983519e4ae45dd80e72e70b79f25c5e
    <= 9000
    => e04280000400000000
    <= 3200bb29fc4fd606567a2146ec33fd3904d978167d8309b510071b276734768397aa4eee01000000ef8b0100000000004daa5993f8b02cde9000
    => e04000001505800000548000000080000000000000010000001b
    <= 41042e00ef5ab04c270bf697e817c5fd433aa4509b063745d6f82c2157a59d59c1b7146956cee1b5ce1c7739a87fb59de3ad918872b14301af3f00b538934837b1382231354a707a787578426b6358384576465a6e6d4d736a74664771314d676e6d465356b9b92151a60d39e94e5be7a91003d0f43f03cafd69db00ebc60a65434d83e66d9000
    => e0440002050100000001
    <= 9000
    => e04480023b01383200bb29fc4fd606567a2146ec33fd3904d978167d8309b510071b276734768397aa4eee01000000ef8b0100000000004daa5993f8b02cde00
    <= 9000
    => e044800204ffffffff
    <= 9000
    => e04aff001505800000548000000080000000000000010000001c
    <= 9000
    => e04a00003202a086010000000000160014562b254f8890788f45c7cf7bd4c81bce789ffcd0bd0400000000000016001483efa2f7154106
    <= 009000
    => e04a80000d6369afcfc98b829886b6c76bf5
    <= 00009000
    => e0440080050100000001
    <= 9000
    => e04480803b01383200bb29fc4fd606567a2146ec33fd3904d978167d8309b510071b276734768397aa4eee01000000ef8b0100000000004daa5993f8b02cde19
    <= 9000
    => e04480801d76a9142f3fa4710983519e4ae45dd80e72e70b79f25c5e88acffffffff
    <= 9000
    => e04800001b05800000548000000080000000000000010000001b000000000001
    <= 3045022100e4acf0eb3803a62399f53825d86aa30743fe999eefb01522d5f7ecd9eeec663d022063b90c512e207c2ac47d8759e1c73c6abeff58daec31c48905193470bc87f2d3019000
    `)
  );
  // This test covers the old bitcoin Nano app 1.6 API, before the breaking changes that occurred in v2.1.0 of the app
  const btc = new Btc({ transport, currency: "oldbitcoin" });
  const tx1 = btc.splitTransaction(
    "01000000000102b91a5eb409e1243dcc02440ad5709d57047946309a515902ffdba8b98ad9e9970000000000ffffff00b91a5eb409e1243dcc02440ad5709d57047946309a515902ffdba8b98ad9e9970100000000ffffff000250c300000000000016001449df9e8ba7e25dd4830579cb42fbea938497168bef8b0100000000001600142f3fa4710983519e4ae45dd80e72e70b79f25c5e0248304502210080ed332c269ae7d86fac26a143afcec0a634e1098fd1ee5ca43cbe0c66de861802204c804eceb4cc9ca397156fa683f46274d22bb5d95f8c8293dc595934899f7927012103cc39edf09d462b4de30cc9bf96b163f18dcee742e0a1ea6fad0274ae0b9d60330247304402203e277d48d19a01c33b45b8f102479eb10811d20991bbf060cab4ba79f0972e61022041e13ed7da2b266d20c36b01694f2d16cf144c1ff66863f26d7c332dc220bc1301210369f216ec068fb7ef17a46ad3ad4d7f0e04e8a3a16ae2da852d6e4b57c3bb972f00000000",
    true
  );
  const result = await btc.createPaymentTransaction({
    inputs: [[tx1, 1, undefined, 0xffffffff]],
    associatedKeysets: ["84'/0'/0'/1/27"],
    changePath: "84'/0'/0'/1/28",
    outputScriptHex:
      "02a086010000000000160014562b254f8890788f45c7cf7bd4c81bce789ffcd0bd0400000000000016001483efa2f71541066369afcfc98b829886b6c76bf5",
    sigHashType: 1,
    segwit: true,
    additionals: ["bitcoin", "bech32"],
  });
  expect(result).toEqual(
    "01000000000101fc4fd606567a2146ec33fd3904d978167d8309b510071b276734768397aa4eee0100000000ffffffff02a086010000000000160014562b254f8890788f45c7cf7bd4c81bce789ffcd0bd0400000000000016001483efa2f71541066369afcfc98b829886b6c76bf502483045022100e4acf0eb3803a62399f53825d86aa30743fe999eefb01522d5f7ecd9eeec663d022063b90c512e207c2ac47d8759e1c73c6abeff58daec31c48905193470bc87f2d30121022e00ef5ab04c270bf697e817c5fd433aa4509b063745d6f82c2157a59d59c1b700000000"
  );
});
