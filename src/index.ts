import {printFileDescriptorTSGRPC} from "./grpc";
import {ExportMap} from "./ExportMap";
import {replaceProtoGrpcSuffix, withAllStdIn} from "./util";
import {CodeGeneratorRequest, CodeGeneratorResponse} from "google-protobuf/google/protobuf/compiler/plugin_pb";
import {FileDescriptorProto} from "google-protobuf/google/protobuf/descriptor_pb";

/**
 * This is the ProtoC compiler plugin.
 *
 * The Protocol Buffers Compiler can be extended to [support new languages via plugins](https://developers.google.com/protocol-buffers/docs/reference/other).
 * A plugin is just a program which reads a CodeGeneratorRequest protocol buffer from standard input
 * and then writes a CodeGeneratorResponse protocol buffer to standard output.
 * These message types are defined in [plugin.proto](https://github.com/google/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto).
 *
 */
withAllStdIn((inputBuff: Buffer) => {
    try {
        const typedInputBuff = new Uint8Array(inputBuff.length);
        typedInputBuff.set(inputBuff);

        const codeGenRequest = CodeGeneratorRequest.deserializeBinary(typedInputBuff);
        const codeGenResponse = new CodeGeneratorResponse();
        const exportMap = new ExportMap();
        const fileNameToDescriptor: { [key: string]: FileDescriptorProto } = {};

        codeGenRequest.getProtoFileList().forEach(protoFileDescriptor => {
            fileNameToDescriptor[protoFileDescriptor.getName()] = protoFileDescriptor;
            exportMap.addFileDescriptor(protoFileDescriptor);
        });

        codeGenRequest.getFileToGenerateList().forEach(fileName => {
            const outputFileName = replaceProtoGrpcSuffix(fileName);
            const thisFile = new CodeGeneratorResponse.File();
            thisFile.setName(outputFileName + ".d.ts");
            thisFile.setContent(printFileDescriptorTSGRPC(fileNameToDescriptor[fileName], exportMap));
            codeGenResponse.addFile(thisFile);
        });

        process.stdout.write(new Buffer(codeGenResponse.serializeBinary()));
    } catch (err) {
        console.error("protoc-gen-grpc-ts error: " + err.stack + "\n");
        process.exit(1);
    }
});
