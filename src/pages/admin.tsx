import { useState, useEffect } from "react";
import AuthGuard from "@/components/shared/AuthGuard";
import {
  subscribeToProjects,
  addProject,
  updateProject,
  deleteProject,
} from "@/services/firestore";
import { Trash2, Edit2, Plus, RefreshCw, X, FolderKanban, Palette, Settings, LifeBuoy } from "lucide-react";
import ConfigPanel from "@/components/admin/ConfigPanel";
import { useSiteConfig } from "@/hooks/useSiteConfig";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologiesUsed?: string[];
  tags?: string[];
  image?: string;
  [key: string]: any;
}

type Tab = "projects" | "appearance";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false); /* Form state */
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    tags: "",
    image: "",
  });

  const { isSyncing } = useSiteConfig();

  useEffect(() => {
    const unsubscribe = subscribeToProjects((data) => {
      setProjects(data as Project[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenForm = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        subtitle: project.subtitle || "",
        description: project.description,
        tags: (project.tags || []).join(", "),
        image: project.image || "",
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        tags: "",
        image: "",
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
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
      <div className="min-h-screen pt-24 pb-12 px-6 bg-background dark:bg-background transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <Settings className="text-primary animate-spin-slow" /> Control Center
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your portfolio data and visual ecosystem
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isSyncing && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Syncing Cloud</span>
                </div>
              )}
              {activeTab === "projects" && (
                <button
                  onClick={() => handleOpenForm()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Plus size={18} /> Add Project
                </button>
              )}
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
            {/* Sidebar Navigation */}
            <aside className="flex flex-col gap-4">
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${activeTab === "projects" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <FolderKanban size={18} /> Projects
              </button>

              <button
                onClick={() => setActiveTab("appearance")}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${activeTab === "appearance" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Palette size={18} /> Appearance
              </button>

              <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2.5 text-primary mb-3">
                  <LifeBuoy size={18} />
                  <span className="text-sm font-bold">Help & Support</span>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Changes to appearance apply instantly to all visitors. Use presets for quick styling.
                </p>
              </div>
            </aside>

            {/* Content Area */}
            <main className="min-h-[500px] pb-24">
              {activeTab === "projects" ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      All Projects <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{projects.length}</span>
                    </h2>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-medium text-muted-foreground">Loading projects...</p>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-24 p-8 rounded-3xl border border-dashed border-border bg-muted/20">
                      <div className="mb-4 flex justify-center text-muted-foreground opacity-50">
                        <RefreshCw size={48} />
                      </div>
                      <h3 className="text-lg font-bold">No Projects Found</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-6">
                        Start by adding a new project to your portfolio.
                      </p>
                      <button onClick={() => handleOpenForm()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold">
                        Add Project
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all group relative overflow-hidden"
                          style={{ boxShadow: 'var(--base-shadow)' }}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex gap-4">
                               {project.image && (
                                 <div className="w-20 h-20 rounded-xl overflow-hidden border border-border bg-muted shrink-0 hidden md:block">
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                 </div>
                               )}
                               <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                    {project.subtitle}
                                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-foreground">
                                  {project.title}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-1 max-w-xl leading-relaxed">
                                  {project.description}
                                </p>
                                {project.tags && (
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    {project.tags.map((tag, i) => (
                                      <span
                                        key={tag + i}
                                        className="px-2 py-0.5 text-[10px] font-medium bg-muted text-foreground rounded-md border border-border"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenForm(project)}
                                className="p-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(project.id)}
                                className="p-2 text-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
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
              ) : (
                <ConfigPanel />
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-background w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-xl font-bold">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-foreground hover:bg-muted rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary focus:bg-background outline-none transition-all"
                    placeholder="e.g. Smart App"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Category</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary focus:bg-background outline-none transition-all"
                    placeholder="e.g. Web App"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary focus:bg-background outline-none resize-none transition-all"
                  placeholder="Describe your work..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary focus:bg-background outline-none transition-all"
                  placeholder="React, AI, Firebase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary focus:bg-background outline-none transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
                {formData.image && (
                  <div className="mt-4 rounded-2xl overflow-hidden border border-border bg-muted aspect-video relative group">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">Image Preview</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-4 justify-end pt-6 border-t border-border mt-8">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 rounded-xl border border-border hover:bg-muted font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {editingProject ? "Update Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
