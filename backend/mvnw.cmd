@echo off
set "MVN_PATH=C:\Users\charan teja\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd"
if exist "%MVN_PATH%" (
    "%MVN_PATH%" %*
) else (
    mvn %*
)
