"use client";

import { useEffect, useState } from "react";
import { IP, SESSION_ID } from "./_utils/constants";
import { Query, SQLMetrics, Worker } from "./_utils/types";

const DashboardPage = () => {
    const [activityLog, setActivityLog] = useState<Query[]>([]);
    const [workerData, setWorkerData] = useState<Worker>({ countryCode: "", iata: "" });
    const [sqlMetrics, setSqlMetrics] = useState<SQLMetrics>({
        queryCount: 0,
        resultCount: 0,
        selectCount: 0,
        selectWhereCount: 0,
        selectLeftJoinCount: 0
    });

    async function fetchWorkerData() {
        const response = await fetch(`https://northwind-iaum.onrender.com/workerData?ip=${IP}`);
        const data = await response.json();
        return data;
    }

    async function fetchSqlMetrics() {
        const response = await fetch(`https://northwind-iaum.onrender.com/responseLogs`, {
            headers: { "session-id": SESSION_ID }
        });
        const data = await response.json();
        return data;
    }

    async function fetchData() {
        try {
            const [workerData, sqlMetrics] = await Promise.all([
                fetchWorkerData(),
                fetchSqlMetrics()
            ]);

            setWorkerData(workerData);
            setSqlMetrics(sqlMetrics);
            setActivityLog(sqlMetrics.activityLog);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div>
                <h2>Worker</h2>
                <p>Colo: {workerData.iata}</p>
                <p>Country: {workerData.countryCode}</p>
            </div>
            <div>
                <h2>SQL Metrics</h2>
                <p>Query count: {sqlMetrics.queryCount}</p>
                <p>Results count: {sqlMetrics.resultCount}</p>
                <p># SELECT: {sqlMetrics.selectCount}</p>
                <p># SELECT WHERE: {sqlMetrics.selectWhereCount}</p>
                <p># SELECT LEFT JOIN: {sqlMetrics.selectLeftJoinCount}</p>
            </div>
            <div>
                <h2>Activity log</h2>
                {activityLog.length === 0 ? (
                    <p>Explore the app and see metrics here</p>
                ) : (
                    activityLog.map((log, index) => (
                        <p key={index}>
                            {log.queriedAt} - {log.Query}
                        </p>
                    ))
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
