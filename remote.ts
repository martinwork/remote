/**
 * Remote blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace remote {
    export interface Connection {
        sendString(data: string): void
    }

    class State {
        handler: (line: string) => void = (command: string) => { };
        lines: string[] = []
        processing: boolean = false
        connections: Connection[] = [];
        connectSerial: ConnectionSerial = undefined
        constructor() {
        }
    }
    export let state: State = undefined

    function initialise(): void {
        if (state == undefined) {
            state = new State
        }
    }

    /**
     * TODO: describe your function here
     */
    function startProcessing(): void {
        initialise()
        if (!state.processing) {
            state.processing = true;
            control.inBackground(function () {
                while (state.processing) {
                    if (state.lines.length) {
                        state.handler(state.lines[0])
                        state.lines.removeElement(state.lines[0])
                    }
                    basic.pause(0)
                }
            })
        }
    }

    /**
     * TODO: describe your function here
     */
    export function addConnection(c: Connection): void {
        initialise()
        state.connections.push(c);
    }


    /**
     * TODO: describe your function here
     */
    //% advanced
    //% block
    export function onReceivedLine(line: string) {
        initialise()
        state.lines.push(line)
        startProcessing()
    }

    /**
     * TODO: describe your function here
     * @param data describe value here
     */
    //% block
    export function sendString(data: string) {
        initialise()
        for (let index = 0; index < state.connections.length; index++) {
            state.connections[index].sendString(data)
        }
    }

    /**
     * TODO: describe your function here
     * @param handler describe value here
     */
    //% draggableParameters=reporter
    //% block
    export function onLine(handler: ( line: string) => void): void {
        initialise()
        state.handler = handler
    }

    class ConnectionSerial implements Connection {
        sendString(data: string) {
            serial.writeLine(data)
        }
        constructor() {
            addConnection(this)
            serial.setWriteLinePadding(0)
            serial.setTxBufferSize(240)
            serial.setRxBufferSize(240)
            serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
                remote.onReceivedLine(serial.readUntil(serial.delimiters(Delimiters.NewLine)))
            })
        }
    }
    let _connectSerial: ConnectionSerial = undefined

    /**
     * TODO: describe your function here
     */
    //% block
    export function useSerial(): void {
        initialise()
        if (state.connectSerial == undefined) {
            state.connectSerial = new ConnectionSerial
        }
    }
}
