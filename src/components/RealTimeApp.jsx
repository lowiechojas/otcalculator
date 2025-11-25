import "../index.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RealTimeApp() {
 const REQUIRED_HOURS = 9;
const REQUIRED_MINUTES = 15;


const [timeIn, setTimeIn] = useState("");
const [timeOut, setTimeOut] = useState("");
const [totalHours, setTotalHours] = useState("-");
const [overtime, setOvertime] = useState("-");
const [logs, setLogs] = useState(() => {
const saved = localStorage.getItem("timeLogs");
return saved ? JSON.parse(saved) : [];
});


useEffect(() => {
localStorage.setItem("timeLogs", JSON.stringify(logs));
}, [logs]);


function parseTime(t) {
const [h, m] = t.split(":").map(Number);
return h * 60 + m;
}


function minutesToHM(mins) {
const h = Math.floor(mins / 60);
const m = mins % 60;
return `${h}h ${m}m`;
}


function calculate() {
if (!timeIn || !timeOut) return;


const inMin = parseTime(timeIn);
const outMin = parseTime(timeOut);


let worked = outMin - inMin;
if (worked < 0) worked += 1440;


setTotalHours(minutesToHM(worked));


const required = REQUIRED_HOURS * 60 + REQUIRED_MINUTES;
const ot = worked - required;
setOvertime(ot > 0 ? minutesToHM(ot) : "0h 0m");
}


useEffect(calculate, [timeIn, timeOut]);


function computeTimeOutFromTimeIn() {
if (!timeIn) return;
const inMin = parseTime(timeIn);
const required = REQUIRED_HOURS * 60 + REQUIRED_MINUTES;
const outMin = (inMin + required) % 1440;
const h = String(Math.floor(outMin / 60)).padStart(2, "0");
const m = String(outMin % 60).padStart(2, "0");
setTimeOut(`${h}:${m}`);
}


function addLog() {
if (!timeIn || !timeOut) return;
setLogs([
...logs,
{
timeIn,
timeOut,
totalHours,
overtime,
date: new Date().toLocaleString(),
},
]);
}


return (
<div className="min-h-screen bg-gray-100 p-6 flex justify-center">
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
<h1 className="text-3xl font-bold text-center mb-6">Time-out and OT Calculator</h1>


<label className="block mb-2 font-semibold">Time In:</label>
<input type="time" className="w-full p-3 border rounded-xl mb-4" value={timeIn} onChange={(e) => setTimeIn(e.target.value)} />


<label className="block mb-2 font-semibold">Time Out:</label>
<input type="time" className="w-full p-3 border rounded-xl mb-4" value={timeOut} onChange={(e) => setTimeOut(e.target.value)} />


<button onClick={computeTimeOutFromTimeIn} className="w-full bg-blue-600 text-white py-3 rounded-xl mb-4 hover:bg-blue-700">Compute Required Time Out</button>


<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-gray-50 rounded-xl shadow-inner mb-4">
<p className="text-lg font-semibold">Total Hours Worked: {totalHours}</p>
<p className="text-lg font-semibold text-red-600">Overtime: {overtime}</p>
</motion.div>


<button onClick={addLog} className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">Save Log</button>


<h2 className="text-xl font-bold mt-6 mb-2">Logs</h2>
<div className="max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-xl shadow-inner">
{logs.map((log, i) => (
<div key={i} className="p-3 border-b">
<p><strong>Date:</strong> {log.date}</p>
<p><strong>In:</strong> {log.timeIn} | <strong>Out:</strong> {log.timeOut}</p>
<p><strong>Total:</strong> {log.totalHours}</p>
<p><strong>OT:</strong> {log.overtime}</p>
</div>
))}
</div>
</motion.div>
</div>
);
}
