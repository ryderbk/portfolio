import { useState, useEffect } from "react";
import AuthGuard from "@/components/bkfiles/AuthGuard";
import { 
    subscribeToProjects, 
    addProject, 
    updateProject, 
    deleteProject,
    syncInitialProjects,
    addRemainingProjects
} from "@/services/firestore";
import { initialProjects } from "@/lib/initial-data";
import { Trash2, Edit2, Plus, RefreshCw, X } from "lucide-react";

interface Project {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    technologiesUsed?: string[];
    tags?: string[];
    [key: string]: any;
}

export default function AdminPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        tags: "",
    });

    useEffect(() => {
        const unsubscribe = subscribeToProjects((data) => {
            setProjects(data as Project[]);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "skipped" | "error">("idle");

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncStatus("idle");
        try {
            console.log("Admin: Triggering sync initial projects...");
            const result = await syncInitialProjects(initialProjects);
            if (result === "success") {
                setSyncStatus("success");
                alert("✅ Success: Initial data synced to Firestore.");
            } else {
                setSyncStatus("skipped");
                alert("⚠️ Collection not empty: Sync was skipped to prevent duplicates.");
            }
        } catch (error: any) {
            console.error("Admin Sync Error:", error);
            setSyncStatus("error");
            alert(`❌ Sync Failed: ${error.message || "Unknown error"}. Check console and Firestore rules.`);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSyncRemaining = async () => {
        setIsSyncing(true);
        setSyncStatus("idle");
        try {
            console.log("Admin: Triggering sync remaining projects...");
            const result = await addRemainingProjects(initialProjects);
            if (result === "success") {
                setSyncStatus("success");
                alert("✅ Success: Remaining data synced to Firestore.");
            }
        } catch (error: any) {
            console.error("Admin Sync Error:", error);
            setSyncStatus("error");
            alert(`❌ Sync Failed: ${error.message || "Unknown error"}. Check console and Firestore rules.`);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleOpenForm = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                subtitle: project.subtitle || "",
                description: project.description,
                tags: (project.tags || []).join(", "),
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: "",
                subtitle: "",
                description: "",
                tags: "",
            });
        }
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const projectData = {
            ...formData,
            tags: formData.tags.split(",").map(t => t.trim()).filter(t => t !== ""),
            updatedAt: new Date(),
        };

        try {
            if (editingProject) {
                await updateProject(editingProject.id, projectData);
            } else {
                await addProject({
                    ...projectData,
                    displayOrder: projects.length,
                    createdAt: new Date(),
                });
            }
            setIsFormOpen(false);
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save project.");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await deleteProject(id);
            } catch (error) {
                alert("Delete failed.");
            }
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen pt-24 pb-12 px-6 bg-white dark:bg-zinc-950">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                                Portfolio Admin
                            </h1>
                            <p className="text-zinc-500 text-sm mt-1">Manage Case Studies & Projects</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => handleSync()}
                                disabled={isSyncing}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                                {isSyncing ? "Syncing..." : "Sync Initial"}
                            </button>
                            <button 
                                onClick={() => handleSyncRemaining()}
                                disabled={isSyncing}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
                                {isSyncing ? "Syncing..." : "Sync Remaining Projects"}
                            </button>
                            <button 
                                onClick={() => handleOpenForm()}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20"
                            >
                                <Plus size={16} />
                                Add Project
                            </button>
                        </div>
                    </div>

                    {/* Active Projects List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">All Projects ({projects.length})</h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-24">
                                <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-24 p-8 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/20">
                                <div className="mb-4 flex justify-center text-zinc-400">
                                    <RefreshCw size={48} strokeWidth={1} />
                                </div>
                                <h3 className="text-lg font-medium mb-1">No Projects Found</h3>
                                <p className="text-sm mb-6">Start by syncing initial data or adding a new project manually.</p>
                                <button 
                                    onClick={handleSync}
                                    className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-medium"
                                >
                                    Sync Now
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {projects.map((project) => (
                                    <div 
                                        key={project.id}
                                        className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">{project.subtitle}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                                    {project.title}
                                                </h3>
                                                <p className="text-zinc-500 text-sm line-clamp-2 max-w-2xl leading-relaxed">
                                                    {project.description}
                                                </p>
                                                {project.tags && (
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {project.tags.map((tag, i) => (
                                                            <span 
                                                                key={tag + i}
                                                                className="px-2 py-0.5 text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-md"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleOpenForm(project)}
                                                    className="p-2 text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(project.id)}
                                                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold">
                                {editingProject ? "Edit Project" : "Add New Project"}
                            </h3>
                            <button 
                                onClick={() => setIsFormOpen(false)}
                                className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Project Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-violet-500 outline-none"
                                        placeholder="e.g. Smart App"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subtitle / Category</label>
                                    <input 
                                        type="text" 
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                        className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-violet-500 outline-none"
                                        placeholder="e.g. Web App"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea 
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                                    placeholder="Write project details..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                                <input 
                                    type="text" 
                                    value={formData.tags}
                                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                    className="w-full px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-violet-500 outline-none"
                                    placeholder="React, AI, Firebase"
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-6 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-8 py-2 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20"
                                >
                                    {editingProject ? "Update Project" : "Save Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthGuard>
    );
}
