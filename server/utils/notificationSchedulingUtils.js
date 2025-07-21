import cron from "node-cron";
import { CONNECTION, DISCONNECT, DELIVER_NOTIFICATION, CRON_INTERVAL_STRING, CRON_INTERVAL_DESCRIPTOR } from "./constants.js";

export const requestNotificationScheduling = (socketServer) => {
    console.log(`Cron generated - running a task every ${CRON_INTERVAL_DESCRIPTOR}`);

    socketServer.on(CONNECTION, (socket) => {
        console.log("notiSched utils: connection established");

        cron.schedule(CRON_INTERVAL_STRING, () => {
            const now = new Date().toLocaleTimeString();
            socket.emit(DELIVER_NOTIFICATION, `Cron job fired at ${now}`);
        });

        socket.on(DISCONNECT, () => {
            console.log("notiSched utils: connection terminated");
        });
    });
};
