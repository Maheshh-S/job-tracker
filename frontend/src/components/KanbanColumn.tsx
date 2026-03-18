import { Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  MessageCircle, 
  Award, 
  XCircle,
  Edit2,
  Trash2,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  User,
  MoreHorizontal,
  Paperclip
} from "lucide-react";
import type { Application, ApplicationStatus } from "../types";
import { useState } from "react";

interface KanbanColumnProps {
  column: {
    id: ApplicationStatus;
    title: string;
    color: string;
    icon: string;
  };
  applications: Application[];
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onEdit?: (app: Application) => void;
  onDelete?: (id: string) => void;
}

const statusIcons = {
  Applied: Send,
  Interviewing: MessageCircle,
  Offer: Award,
  Rejected: XCircle,
};

const statusColors = {
  Applied: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500"
  },
  Interviewing: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-500"
  },
  Offer: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500"
  },
  Rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500"
  },
};

const KanbanColumn = ({ column, applications, onStatusChange, onEdit, onDelete }: KanbanColumnProps) => {
  const Icon = statusIcons[column.id];
  const colors = statusColors[column.id];
  const [showActions, setShowActions] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);

  // Function to get random gradient for company logo placeholder
  const getCompanyGradient = (company: string) => {
    const gradients = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-green-500 to-green-600",
      "from-yellow-500 to-yellow-600",
      "from-red-500 to-red-600",
      "from-indigo-500 to-indigo-600",
      "from-pink-500 to-pink-600",
    ];
    const index = company.length % gradients.length;
    return gradients[index];
  };

  // Function to get company initials
  const getInitials = (company: string) => {
    return company
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center justify-between p-4 rounded-t-xl ${column.color}`}
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5" />
          <h3 className="font-semibold">{column.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-white/30 backdrop-blur-sm px-2.5 py-1 rounded-full text-sm font-medium">
            {applications.length}
          </span>
        </div>
      </motion.div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[500px] p-3 space-y-3 rounded-b-xl transition-all duration-200 ${
              snapshot.isDraggingOver ? 'bg-blue-50/50 ring-2 ring-blue-200 ring-inset' : 'bg-gray-50/50'
            }`}
          >
            <AnimatePresence>
              {applications.map((app, index) => (
                <Draggable key={app._id} draggableId={app._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -2 }}
                        className={`relative bg-white rounded-xl shadow-sm border ${
                          snapshot.isDragging 
                            ? 'shadow-lg ring-2 ring-blue-400 ring-opacity-50 border-blue-200' 
                            : 'border-gray-200 hover:shadow-md'
                        } transition-all duration-200 overflow-hidden`}
                        onMouseEnter={() => setShowActions(app._id)}
                        onMouseLeave={() => {
                          setShowActions(null);
                          setExpandedNotes(null);
                        }}
                      >
                        {/* Card Header with Company Logo */}
                        <div className="p-4 pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              {/* Company Logo Placeholder */}
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCompanyGradient(app.company)} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                                {getInitials(app.company)}
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 leading-tight">{app.company}</h4>
                                <p className="text-sm text-gray-600 flex items-center mt-0.5">
                                  <span className="truncate max-w-[150px]">{app.role}</span>
                                </p>
                              </div>
                            </div>

                            {/* Card Actions */}
                            <AnimatePresence>
                              {showActions === app._id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="flex space-x-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1"
                                >
                                  <button
                                    onClick={() => onEdit?.(app)}
                                    className="p-1.5 rounded-md hover:bg-blue-50 transition-colors group"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-600" />
                                  </button>
                                  <button
                                    onClick={() => onDelete?.(app._id)}
                                    className="p-1.5 rounded-md hover:bg-red-50 transition-colors group"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-600" />
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Date Badge */}
                          <div className="flex items-center mt-3 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            {new Date(app.appliedDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        {/* Notes Section - BEAUTIFULLY STYLED */}
                        {app.notes && (
                          <motion.div 
                            initial={false}
                            animate={{ height: expandedNotes === app._id ? 'auto' : 'auto' }}
                            className="mt-2 px-4 pb-4"
                          >
                            <div 
                              onClick={() => setExpandedNotes(expandedNotes === app._id ? null : app._id)}
                              className={`group relative cursor-pointer transition-all duration-200 ${
                                expandedNotes === app._id ? '' : 'hover:bg-gray-50'
                              }`}
                            >
                              {/* Notes Header */}
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center space-x-1.5">
                                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                                    <FileText className="w-3 h-3 text-amber-600" />
                                  </div>
                                  <span className="text-xs font-medium text-gray-600">Notes</span>
                                </div>
                                {app.notes.length > 100 && (
                                  <span className="text-[10px] text-gray-400">
                                    {expandedNotes === app._id ? 'Show less' : 'Click to expand'}
                                  </span>
                                )}
                              </div>

                              {/* Notes Content - Beautiful Card Style */}
                              <motion.div 
                                className={`
                                  relative rounded-lg overflow-hidden
                                  ${expandedNotes === app._id 
                                    ? 'bg-gradient-to-br from-amber-50 to-amber-50/50 border border-amber-200' 
                                    : 'bg-gray-50 border border-gray-100'
                                  }
                                `}
                              >
                                {/* Decorative Quote Mark */}
                                <div className="absolute top-2 right-2 text-4xl opacity-10 select-none">
                                  "
                                </div>

                                <div className="p-3">
                                  <motion.p 
                                    className={`
                                      text-sm leading-relaxed
                                      ${expandedNotes === app._id 
                                        ? 'text-gray-700' 
                                        : 'text-gray-600 line-clamp-2'
                                      }
                                    `}
                                  >
                                    {app.notes}
                                  </motion.p>

                                  {/* Note Metadata (if any attachments or tags in future) */}
                                  {expandedNotes === app._id && (
                                    <motion.div 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="flex items-center space-x-2 mt-2 pt-2 border-t border-amber-200/50"
                                    >
                                      <Paperclip className="w-3 h-3 text-amber-400" />
                                      <span className="text-[10px] text-amber-600">Added {new Date().toLocaleDateString()}</span>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>

                              {/* Expand/Collapse Indicator */}
                              {app.notes.length > 100 && (
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                  <div className={`
                                    w-6 h-6 rounded-full bg-white shadow-sm border flex items-center justify-center
                                    ${expandedNotes === app._id ? 'border-amber-200' : 'border-gray-200'}
                                  `}>
                                    <MoreHorizontal className={`w-3 h-3 ${expandedNotes === app._id ? 'text-amber-500' : 'text-gray-400'}`} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Status Indicator Line */}
                        <div className={`h-1 w-full ${colors.dot.replace('bg-', 'bg-')} opacity-50`} />
                      </motion.div>
                    </div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}

            {/* Empty State */}
            {applications.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-32 text-center p-4"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">No applications yet</p>
                <p className="text-[10px] text-gray-300 mt-1">Drag or add new</p>
              </motion.div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;