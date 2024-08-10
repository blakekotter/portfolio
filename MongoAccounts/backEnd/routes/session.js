const express = require("express");
const routes = express.Router();

routes.route("/session_set").get(async function (req, res) {
    try {
        console.log("In /session_set, session is: " + req.session);

        if (!req.session.username) {
            req.session.username = "Blake";
            const status = "Session set";
            console.log(status);
            res.json({ status });
        } else {
            const status = "Session already set";
            console.log(status);
            res.json({ status });
        }
    } catch (error) {
        console.error("Error setting session:", error);
        res.status(500).json({ error: "Failed to set session" });
    }
});

routes.route("/session_get").get(async function (req, res) {
    try {
        console.log("In /session_get, session is: " + req.session);

        if (!req.session.username) {
            req.session.username = "Blake";
            const status = "No session set";
            console.log(status);
            res.json({ status });
        } else {
            const status = "Session username is: " + req.session.username;
            console.log(status);
            res.json({ status });
        }
    } catch (error) {
        console.error("Error getting session:", error);
        res.status(500).json({ error: "Failed to get session" });
    }
});

routes.route("/session_delete").delete(async function (req, res) {
    try {
        console.log("In /session_delete, session is: " + req.session);

        req.session.destroy();
        const status = "Session deleted";
        console.log(status);
        res.json({ status });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ error: "Failed to delete session" });
    }
});

module.exports = routes;
