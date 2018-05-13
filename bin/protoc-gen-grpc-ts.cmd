@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\protoc-gen-grpc-ts" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\protoc-gen-grpc-ts" %*
)