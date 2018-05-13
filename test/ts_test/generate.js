const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const exe_ext = process.platform === 'win32' ? '.exe' : '';
const cmd_ext = process.platform === 'win32' ? '.cmd' : '';

const grpcToolsDir = path.join(path.dirname(require.resolve('grpc-tools')), 'bin');
const protoc = path.join(grpcToolsDir, 'protoc' + exe_ext);
const protocGrpcPlugin = path.join(grpcToolsDir, 'grpc_node_plugin' + exe_ext);
const protocGenTsPlugin = path.join('..', '..', 'node_modules', '.bin', 'protoc-gen-ts' + cmd_ext);
const protocGenTsGrpcPlugin = path.join('..', '..', 'bin', 'protoc-gen-grpc-ts' + cmd_ext);

let protoPath = path.resolve(__dirname, '..', 'proto');
let outPath = path.join(__dirname, 'generated');

rimraf(outPath, () => fs.mkdir(outPath, () => {
    const child = require('child_process').execFile(protoc, [
        `--proto_path=${protoPath}`,
        `--js_out=import_style=commonjs,binary:${outPath}`,
        `--grpc_out=${outPath}`,
        `--ts_out=${outPath}`,
        `--grpc-ts_out=${outPath}`,
        `--plugin=protoc-gen-grpc=${protocGrpcPlugin}`,
        `--plugin=protoc-gen-ts=${protocGenTsPlugin}`,
        `--plugin=protoc-gen-grpc-ts=${protocGenTsGrpcPlugin}`,
        path.join(protoPath, 'orphan.proto'),
        path.join(protoPath, 'examplecom/simple_service.proto'),
        path.join(protoPath, 'othercom/external_child_message.proto'),
    ], {
        encoding: 'utf8'
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
}));
