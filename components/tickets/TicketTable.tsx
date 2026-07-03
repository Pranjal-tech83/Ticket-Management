'use client';

import React, { useState } from 'react';
import { useTicketStore } from '@/store/useTicketStore';
import { useUIStore } from '@/store/useUIStore';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '@/types';
import { 
  getStatusColor, 
  getPriorityColor, 
  getSeverityColor, 
  formatDate 
} from '@/lib/utils';
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye,
  SlidersHorizontal,
  Bot
} from 'lucide-react';

export default function TicketTable() {
  const { 
    tickets, 
    searchQuery, 
    statusFilter, 
    priorityFilter, 
    categoryFilter,
    setStatusFilter,
    setPriorityFilter,
    setCategoryFilter,
    setSelectedTicket 
  } = useTicketStore();

  const [sortField, setSortField] = useState<keyof Ticket>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter Logic
  const filteredTickets = tickets.filter((t) => {
    // Search matching
    const matchesSearch = 
      t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.createdBy.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter matching
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sorting Logic
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sortedTickets.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = sortedTickets.slice(startIndex, startIndex + itemsPerPage);

  const toggleSort = (field: keyof Ticket) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Ticket ID,Creator,Department,Subject,Category,Priority,Severity,Status,Assigned Agent,Created Date\n';
    const rows = sortedTickets.map((t) => {
      return `"${t.ticketId}","${t.createdBy}","${t.department}","${t.subject.replace(/"/g, '""')}","${t.category}","${t.priority}","${t.severity}","${t.status}","${t.assignedAgent || 'Unassigned'}","${t.createdAt}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `supportpilot-tickets-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-card/40 p-4 rounded-xl border border-border/40">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
            className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>

          {/* Priority filter */}
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'all')}
            className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {/* Category filter */}
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | 'all')}
            className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="technical">Technical / API</option>
            <option value="billing">Billing</option>
            <option value="account">Account</option>
            <option value="feature_request">Feature Request</option>
            <option value="bug">Bug</option>
          </select>
        </div>

        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Table Container */}
      <div className="border border-border/40 rounded-xl overflow-hidden bg-card/25 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider">
                <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => toggleSort('ticketId')}>
                  <div className="flex items-center gap-1">ID <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => toggleSort('createdBy')}>
                  <div className="flex items-center gap-1">User <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-3.5">Dept</th>
                <th className="p-3.5">Subject</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => toggleSort('priority')}>
                  <div className="flex items-center gap-1">Priority <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-foreground" onClick={() => toggleSort('severity')}>
                  <div className="flex items-center gap-1">Severity <ArrowUpDown size={12} /></div>
                </th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Agent</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-muted-foreground">
                    No tickets match the selected filters or search queries.
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket) => (
                  <tr 
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="hover:bg-muted/30 cursor-pointer transition-colors group"
                  >
                    <td className="p-3.5 font-semibold text-primary font-mono">{ticket.ticketId}</td>
                    <td className="p-3.5 max-w-[120px] truncate">
                      <span className="font-medium text-foreground block truncate">{ticket.createdBy.split('(')[0]}</span>
                      <span className="text-[10px] text-muted-foreground truncate block">{ticket.createdBy.split('(')[1]?.replace(')', '') || ''}</span>
                    </td>
                    <td className="p-3.5 text-muted-foreground">{ticket.department}</td>
                    <td className="p-3.5 max-w-xs truncate font-medium text-foreground group-hover:text-primary transition-colors">
                      {ticket.subject}
                    </td>
                    <td className="p-3.5 capitalize text-muted-foreground">{ticket.category}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${getSeverityColor(ticket.severity)}`}>
                        {ticket.severity}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-foreground">{ticket.assignedAgent || 'Unassigned'}</td>
                    <td className="p-3.5 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                        }}
                        className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground inline-flex items-center justify-center transition-all"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground font-medium">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTickets.length)} of {sortedTickets.length} tickets
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all text-foreground"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-semibold px-2 text-foreground">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all text-foreground"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
