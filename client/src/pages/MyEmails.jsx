import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import Loader from '../components/Loader';
import EmailStatsChart from '../components/EmailStatsChart';
import { 
  FolderArchive, 
  Eye, 
  Copy, 
  Trash2, 
  Calendar, 
  Tag, 
  Search, 
  Filter, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  ArrowRight,
  MailCheck,
  RefreshCw
} from 'lucide-react';

const MyEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Modals & Selected Email
  const [viewingEmail, setViewingEmail] = useState(null);
  const [deletingEmail, setDeletingEmail] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await api.get('/emails');
      if (response.data?.data) {
        setEmails(response.data.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch email history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleCopy = async (email, e) => {
    if (e) e.stopPropagation();
    const fullText = `Subject: ${email.subject}\n\n${email.generatedContent}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedId(email._id);
      showToast('Email copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  // Safe delete with confirmation dialog (FR-6.5)
  const confirmDelete = async () => {
    if (!deletingEmail) return;
    setActionLoading(true);

    try {
      await api.delete(`/emails/${deletingEmail._id}`);
      setEmails((prev) => prev.filter((item) => item._id !== deletingEmail._id));
      showToast('Email deleted successfully from your history.');
      setDeletingEmail(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete email.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtered emails based on search and category
  const filteredEmails = emails.filter((item) => {
    const matchesSearch =
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.generatedContent?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || item.emailType === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1.5">
            <FolderArchive className="w-4 h-4" />
            <span>Personal Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Saved Emails
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, inspect, copy, or manage your previously generated emails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchEmails}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/generate"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Email</span>
          </Link>
        </div>
      </div>

      {/* Analytics Chart (Recharts integration) */}
      <EmailStatsChart emails={emails} />

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved emails by subject or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Leave Request">Leave Request</option>
            <option value="Permission Request">Permission Request</option>
            <option value="Complaint">Complaint</option>
            <option value="Job/Internship">Job/Internship</option>
            <option value="Thank You">Thank You</option>
            <option value="General Request">General Request</option>
          </select>
        </div>

      </div>

      {/* Email List / Cards (FR-6.1, FR-6.2) */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader message="Loading your saved email history..." />
        </div>
      ) : filteredEmails.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEmails.map((email) => (
            <div
              key={email._id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-6 flex flex-col justify-between"
            >
              <div>
                {/* Meta header: Type Badge & Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    <Tag className="w-3 h-3" />
                    {email.emailType}
                  </span>
                  
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(email.createdAt)}</span>
                  </div>
                </div>

                {/* Subject Line (FR-6.2) */}
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {email.subject}
                </h3>

                {/* Short Snippet Preview (FR-6.2) */}
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {email.generatedContent}
                </p>

                <div className="text-[11px] text-slate-400 mb-4">
                  <span className="font-semibold text-slate-600">Tone:</span> {email.tone}
                </div>
              </div>

              {/* Action Buttons (FR-6.3, FR-6.4, FR-6.5) */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-2">
                <button
                  onClick={() => setViewingEmail(email)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCopy(email, e)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                    title="Copy full email"
                  >
                    {copiedId === email._id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setDeletingEmail(email)}
                    className="p-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 text-rose-600 transition-colors"
                    title="Delete saved email"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <MailCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {searchTerm || filterType !== 'All' ? 'No emails match your filter' : 'No Saved Emails Yet'}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {searchTerm || filterType !== 'All'
              ? 'Try adjusting your search keywords or category dropdown.'
              : 'Generate an email using the interactive studio and click "Save Email" to build your library.'}
          </p>
          <Link
            to="/generate"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Your First Email</span>
          </Link>
        </div>
      )}

      {/* View Email Full Modal (FR-6.3) */}
      <Modal
        isOpen={!!viewingEmail}
        onClose={() => setViewingEmail(null)}
        title="Saved Email Preview"
        maxWidth="max-w-2xl"
      >
        {viewingEmail && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
              <span className="font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                {viewingEmail.emailType} • {viewingEmail.tone} Tone
              </span>
              <span className="text-slate-400">{formatDate(viewingEmail.createdAt)}</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Subject
              </label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-semibold text-sm">
                {viewingEmail.subject}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Email Content
              </label>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-sm whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto font-normal">
                {viewingEmail.generatedContent}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewingEmail(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => handleCopy(viewingEmail)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Email</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal (FR-6.5) */}
      <Modal
        isOpen={!!deletingEmail}
        onClose={() => setDeletingEmail(null)}
        title="Confirm Email Deletion"
        maxWidth="max-w-md"
      >
        {deletingEmail && (
          <div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 text-rose-800 mb-4 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>Are you sure you want to permanently delete this saved email from your account? This action cannot be undone.</span>
            </div>

            <p className="text-sm font-semibold text-slate-800 mb-6 truncate">
              "{deletingEmail.subject}"
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingEmail(null)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm shadow-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{actionLoading ? 'Deleting...' : 'Delete Email'}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default MyEmails;
