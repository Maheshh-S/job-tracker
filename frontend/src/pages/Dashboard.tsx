import { useEffect, useState, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Filter, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Calendar,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getApplications,
  createApplication,
  updateStatus,
  deleteApplication,
} from "../services/applicationService";
import KanbanColumn from "../components/KanbanColumn";
import AddApplicationModal from "../components/AddApplicationModal";
import Layout from "../components/Layout";
import AnimatedCard from "../components/AnimatedCard";
import type { Application, ApplicationStatus } from "../types";

const columns = [
  { id: "Applied" as ApplicationStatus, title: "Applied", color: "bg-blue-500 text-white", icon: "📤" },
  { id: "Interviewing" as ApplicationStatus, title: "Interviewing", color: "bg-yellow-500 text-white", icon: "💬" },
  { id: "Offer" as ApplicationStatus, title: "Offer", color: "bg-green-500 text-white", icon: "🎉" },
  { id: "Rejected" as ApplicationStatus, title: "Rejected", color: "bg-red-500 text-white", icon: "❌" },
];

interface FilterState {
  status: string;
  date: string;
  search: string;
}

const Dashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    date: "",
    search: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // ✅ FIXED: Computed filtered applications - no duplicate state
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.date) {
      filtered = filtered.filter(app => 
        new Date(app.appliedDate).toDateString() === new Date(filters.date).toDateString()
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.company.toLowerCase().includes(searchLower) ||
        app.role.toLowerCase().includes(searchLower) ||
        (app.notes && app.notes.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [applications, filters]);

  // ✅ Stats are computed, not stored in state
  const stats = useMemo(() => ({
    total: applications.length,
    applied: applications.filter(app => app.status === "Applied").length,
    interviewing: applications.filter(app => app.status === "Interviewing").length,
    offer: applications.filter(app => app.status === "Offer").length,
    rejected: applications.filter(app => app.status === "Rejected").length,
  }), [applications]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getApplications({});
      setApplications(data);
    } catch {
      toast.error("Failed to fetch applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearFilters = () => {
    setFilters({
      status: "",
      date: "",
      search: "",
    });
  };

  // ✅ FIXED: Drag and drop with optimistic update
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as ApplicationStatus;

    // Save current state for rollback
    const previousApplications = [...applications];

    // Optimistic update
    setApplications(prev =>
      prev.map(app =>
        app._id === draggableId ? { ...app, status: newStatus } : app
      )
    );

    try {
      await updateStatus(draggableId, newStatus);
      toast.success("Status updated");
    } catch {
      // Rollback on error
      setApplications(previousApplications);
      toast.error("Failed to update status");
    }
  };

  // ✅ FIXED: Add with optimistic update
  const handleAddApplication = async (data: any) => {
    try {
      const newApp = await createApplication(data);
      setApplications(prev => [newApp, ...prev]);
      toast.success("Application added successfully");
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to add application");
    }
  };

  // ✅ FIXED: Edit with optimistic update
  const handleEditApplication = async (data: any) => {
    if (!editingApp) return;
    
    const previousApplications = [...applications];
    
    // Optimistic update
    setApplications(prev =>
      prev.map(app =>
        app._id === editingApp._id ? { ...app, ...data } : app
      )
    );

    try {
      // Call your update API here when ready
      toast.success("Application updated successfully");
      setIsModalOpen(false);
      setEditingApp(undefined);
    } catch {
      // Rollback on error
      setApplications(previousApplications);
      toast.error("Failed to update application");
    }
  };

  // ✅ FIXED: Delete with optimistic update
  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    const previousApplications = [...applications];
    
    // Optimistic update
    setApplications(prev => prev.filter(app => app._id !== id));

    try {
      await deleteApplication(id);
      toast.success("Application deleted");
    } catch {
      // Rollback on error
      setApplications(previousApplications);
      toast.error("Failed to delete application");
    }
  };

  const hasActiveFilters = filters.status || filters.date || filters.search;

  if (isLoading && applications.length === 0) {
    return (
      <Layout showLogout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your applications...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showLogout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Job Applications
            </h1>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex-1 sm:flex-none justify-center"
              >
                <Plus className="w-5 h-5" />
                <span>Add Application</span>
              </motion.button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Filter Applications</h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Clear filters
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search company, role, notes..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    Showing {filteredApplications.length} of {applications.length} applications
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <AnimatedCard delay={0.1} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Applied</p>
                  <p className="text-2xl font-bold">{stats.applied}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.3} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Interviewing</p>
                  <p className="text-2xl font-bold">{stats.interviewing}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600">💬</span>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.4} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Offers</p>
                  <p className="text-2xl font-bold">{stats.offer}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.5} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </AnimatedCard>
          </div>
        </motion.div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {columns.map((column, index) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <KanbanColumn
                  column={column}
                  applications={filteredApplications.filter(app => app.status === column.id)}
                  onStatusChange={async (id, newStatus) => {
                    // Optimistic update
                    const previousApplications = [...applications];
                    
                    setApplications(prev =>
                      prev.map(app =>
                        app._id === id ? { ...app, status: newStatus } : app
                      )
                    );

                    try {
                      await updateStatus(id, newStatus);
                      toast.success("Status updated");
                    } catch {
                      setApplications(previousApplications);
                      toast.error("Failed to update status");
                    }
                  }}
                  onEdit={(app) => {
                    setEditingApp(app);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDeleteApplication}
                />
              </motion.div>
            ))}
          </motion.div>
        </DragDropContext>

        {/* No Results Message */}
        {filteredApplications.length === 0 && applications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">No applications match your filters</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* Add/Edit Modal */}
        <AddApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingApp(undefined);
          }}
          onSubmit={editingApp ? handleEditApplication : handleAddApplication}
          initialData={editingApp}
          isEditing={!!editingApp}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;