import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Clock, User, BookOpen, Calendar, Hash } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import dataManager from '../../services/dataManager';

export function AdvancedSearch({ onResultSelect, placeholder = "Search students, teachers, classes..." }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const { addNotification } = useApp();

  const filters = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'students', label: 'Students', icon: User },
    { id: 'teachers', label: 'Teachers', icon: User },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Close search on outside click
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      performSearch(query, activeFilter);
    } else {
      setResults([]);
      if (query.length === 0 && !isOpen) {
        // Show recent searches when input is focused and empty
        setResults(recentSearches.map(search => ({ ...search, isRecent: true })));
      }
    }
  }, [query, activeFilter]);

  const performSearch = async (searchQuery, filter) => {
    setIsLoading(true);
    try {
      let searchResults = [];

      switch (filter) {
        case 'students':
          const students = await dataManager.getStudents({ search: searchQuery });
          searchResults = students.map(student => ({
            id: student.id,
            type: 'student',
            title: `${student.firstName} ${student.lastName}`,
            subtitle: `Class ${student.standard}-${student.division} • Roll: ${student.rollNumber}`,
            icon: User,
            data: student,
          }));
          break;

        case 'teachers':
          // Mock teacher search - replace with actual API call
          searchResults = [
            {
              id: '1',
              type: 'teacher',
              title: 'John Smith',
              subtitle: 'Mathematics Teacher • Experience: 5 years',
              icon: User,
              data: { id: '1', name: 'John Smith', subject: 'Mathematics' },
            },
          ].filter(teacher =>
            teacher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
          );
          break;

        case 'classes':
          // Mock class search - replace with actual API call
          searchResults = [
            {
              id: '1',
              type: 'class',
              title: 'Class 10-A',
              subtitle: 'Mathematics • 35 students',
              icon: BookOpen,
              data: { standard: 10, division: 'A', subject: 'Mathematics' },
            },
          ].filter(cls =>
            cls.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          break;

        case 'attendance':
          // Mock attendance search - replace with actual API call
          searchResults = [
            {
              id: '1',
              type: 'attendance',
              title: 'Today\'s Attendance',
              subtitle: 'Class 10-A • Present: 32/35',
              icon: Calendar,
              data: { date: new Date().toISOString().split('T')[0], class: '10-A' },
            },
          ];
          break;

        default:
          // Combined search
          const [studentResults, teacherResults] = await Promise.all([
            dataManager.getStudents({ search: searchQuery }),
            // Add teacher search here
          ]);

          searchResults = [
            ...studentResults.map(student => ({
              id: student.id,
              type: 'student',
              title: `${student.firstName} ${student.lastName}`,
              subtitle: `Student • Class ${student.standard}-${student.division}`,
              icon: User,
              data: student,
            })),
            // Add teacher results here
          ];
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      addNotification('Search failed. Please try again.', 'error');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result) => {
    // Save to recent searches
    const recentItem = {
      id: result.id,
      type: result.type,
      title: result.title,
      subtitle: result.subtitle,
      timestamp: Date.now(),
    };

    const updatedRecent = [recentItem, ...recentSearches.filter(r => r.id !== result.id)].slice(0, 10);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

    // Close search and call callback
    setIsOpen(false);
    setQuery('');
    onResultSelect?.(result);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'student':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'teacher':
        return <User className="w-4 h-4 text-green-500" />;
      case 'class':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'attendance':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-white/60" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (query.length > 0 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full mt-2 w-full bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl z-50 overflow-hidden"
          >
            {/* Filters */}
            <div className="p-3 border-b border-white/10">
              <div className="flex space-x-1 overflow-x-auto">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        activeFilter === filter.id
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white/60">Searching...</p>
                </div>
              ) : results.length === 0 && query.length >= 2 ? (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No results found</p>
                  <p className="text-white/40 text-sm mt-1">Try adjusting your search terms</p>
                </div>
              ) : (
                <div>
                  {query.length === 0 && results.some(r => r.isRecent) && (
                    <div className="p-3 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-white/60" />
                        <span className="text-white/60 text-sm font-medium">Recent Searches</span>
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-white/40 hover:text-white/60 text-sm transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        {getResultIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{result.title}</p>
                          <p className="text-white/60 text-sm truncate">{result.subtitle}</p>
                          {result.isRecent && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Clock className="w-3 h-3 text-white/40" />
                              <span className="text-white/40 text-xs">
                                {new Date(result.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Quick Search Component (for smaller search bars)
export function QuickSearch({ onSearch, placeholder = "Quick search..." }) {
  const [query, setQuery] = useState('');
  const { withLoading } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    await withLoading('quick-search', async () => {
      await onSearch(query.trim());
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-4 pr-12 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-l-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-blue-500/20 hover:bg-blue-500/30 rounded-md transition-colors"
        >
          <Search className="w-4 h-4 text-blue-400" />
        </button>
      </div>
    </form>
  );
}