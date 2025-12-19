remote.onLine(function (line) {
    remote.sendString("echo " + line)
})
remote.useSerial()
