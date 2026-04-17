"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getCountFromServer } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";

interface Stats {
    projects: number;
    skills: number;
    experiences: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, experiences: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const db = getFirestoreDb();

                const [projectsCount, skillsCount, expCount] = await Promise.all([
                    getCountFromServer(collection(db, "projects")),
                    getCountFromServer(collection(db, "skills")),
                    getCountFromServer(collection(db, "experiences")),
                ]);

                setStats({
                    projects: projectsCount.data().count,
                    skills: skillsCount.data().count,
                    experiences: expCount.data().count,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const statsCards = [
        { label: "Projects", value: stats.projects, href: "/admin/projects" },
        { label: "Skills", value: stats.skills, href: "/admin/skills" },
        { label: "Experience", value: stats.experiences, href: "/admin/experience" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    Welcome back! 👋
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                    Here's an overview of your portfolio content
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {statsCards.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500/50 transition-all"
                    >
                        <div>
                            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                {loading ? "-" : stat.value}
                            </p>
                            <p className="text-zinc-600 dark:text-zinc-400">{stat.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl p-6 text-white">
                <h2 className="text-lg font-semibold mb-2">Connected to Firebase</h2>
                <p className="text-violet-100">
                    Your portfolio data is now synced with Firebase Firestore. Any changes you make in the admin panel will automatically appear on your public portfolio.
                </p>
            </div>
        </div>
    );
}
