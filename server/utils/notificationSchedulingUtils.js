import cron from "node-cron";
import { CONNECTION, DISCONNECT, DELIVER_NOTIFICATION } from "./constants.js";

export const requestNotificationScheduling = (socketServer) => {
    console.log("running a task every thirty seconds");

    socketServer.on(CONNECTION, (socket) => {
        console.log("notiSched utils: connection established");

        cron.schedule("*/5 * * * * *", () => {
            const now = new Date().toLocaleTimeString();
            socket.emit(DELIVER_NOTIFICATION, `Cron job fired at ${now}`);
        });

        socket.on(DISCONNECT, () => {
            console.log("notiSched utils: connection terminated");
        });
    });
};
