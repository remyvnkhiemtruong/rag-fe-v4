import { createContext, useContext, useState, useEffect } from 'react';
import { TAGS_DATA, TAG_CATEGORIES, mergeTagsWithDefaults } from '../data/tags';
import { getLocalizedField } from '../utils/i18nField';

const TagContext = createContext(null);

export function TagProvider({ children }) {
  const [tags, setTags] = useState([]);
  const [categories] = useState(TAG_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Load tags from localStorage or use default data
  useEffect(() => {
    const storedTags = localStorage.getItem('heritage_tags');
    if (storedTags) {
      try {
        setTags(mergeTagsWithDefaults(JSON.parse(storedTags)));
      } catch {
        setTags(TAGS_DATA);
      }
    } else {
      setTags(TAGS_DATA);
    }
    setLoading(false);
  }, []);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    if (!loading && tags.length > 0) {
      localStorage.setItem('heritage_tags', JSON.stringify(tags));
    }
  }, [tags, loading]);

  // Add a new tag
  const addTag = (newTag) => {
    const maxId = tags.reduce((max, tag) => Math.max(max, tag.id), 0);
    const tagWithId = {
      ...newTag,
      id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    setTags(prevTags => [...prevTags, tagWithId]);
    return tagWithId;
  };

  // Update an existing tag
  const updateTag = (id, updatedData) => {
    setTags(prevTags =>
      prevTags.map(tag =>
        tag.id === id
          ? { ...tag, ...updatedData, updatedAt: new Date().toISOString() }
          : tag
      )
    );
  };

  // Delete a tag
  const deleteTag = (id) => {
    setTags(prevTags => prevTags.filter(tag => tag.id !== id));
  };

  // Get tag by ID
  const getTagById = (id) => {
    return tags.find(tag => tag.id === id);
  };

  // Get tags by category
  const getTagsByCategory = (category) => {
    return tags.filter(tag => tag.category === category);
  };

  // Search tags
  const searchTags = (query) => {
    if (!query) return tags;
    const lowerQuery = query.toLowerCase();
    return tags.filter(tag =>
      tag.name.toLowerCase().includes(lowerQuery) ||
      tag.nameEn.toLowerCase().includes(lowerQuery) ||
      (tag.nameZh || '').toLowerCase().includes(lowerQuery) ||
      (tag.nameKm || '').toLowerCase().includes(lowerQuery)
    );
  };

  // Get category info
  const getCategoryInfo = (categoryId) => {
    return categories.find(cat => cat.id === categoryId);
  };

  // Localized display helpers (fallback handled in helper)
  const getTagDisplayName = (tag, languageCode) => {
    return getLocalizedField(tag, 'name', languageCode, tag?.name || '');
  };

  const getCategoryDisplayName = (category, languageCode) => {
    return getLocalizedField(category, 'name', languageCode, category?.name || '');
  };

  // Get category color class
  const getCategoryColorClass = (categoryId) => {
    const colorMap = {
      heritage: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-300 dark:border-red-700'
      },
      people: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-300 dark:border-amber-700'
      },
      festival: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-300 dark:border-green-700'
      },
      location: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-700'
      },
      period: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-300 dark:border-purple-700'
      },
      topic: {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-300 dark:border-orange-700'
      }
    };
    return colorMap[categoryId] || colorMap.topic;
  };

  // Reset tags to default
  const resetTags = () => {
    setTags(TAGS_DATA);
    localStorage.setItem('heritage_tags', JSON.stringify(TAGS_DATA));
  };

  const value = {
    tags,
    categories,
    loading,
    addTag,
    updateTag,
    deleteTag,
    getTagById,
    getTagsByCategory,
    searchTags,
    getCategoryInfo,
    getTagDisplayName,
    getCategoryDisplayName,
    getCategoryColorClass,
    resetTags,
    totalTags: tags.length
  };

  return (
    <TagContext.Provider value={value}>
      {children}
    </TagContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTags must be used within a TagProvider');
  }
  return context;
}

export default TagContext;
