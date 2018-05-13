package(default_visibility=["//visibility:public"])
load("@build_bazel_rules_nodejs//:defs.bzl", "nodejs_binary")

nodejs_binary(
    name = "protoc-gen-grpc-ts",
    data = [
        "@//:node_modules",
        "@//src",
    ],
    entry_point = "protoc_gen_grpc_ts/src/index",
    args = ["--node_options=--expose-gc"],
)
