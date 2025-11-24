import React, { useState, useEffect } from 'react'
import './AdminApp.css'

// Dynamically determine API base URL based on current hostname
const getApiBase = () => {
  // Use environment variable if available (for production)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  
  const hostname = window.location.hostname
  // If accessing from localhost, use localhost for API
  // Otherwise use the same hostname (for network access)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api'
  }
  // For network access, use the same hostname but different port
  return `http://${hostname}:3001/api`
}

const API_BASE = getApiBase()

const AdminApp = ({ onLogout }) => {
  const [shelves, setShelves] = useState([])
  const [selectedShelf, setSelectedShelf] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showShelfForm, setShowShelfForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearchOverlay, setShowSearchOverlay] = useState(false)

  useEffect(() => {
    loadShelves()
  }, [])

  const loadShelves = async () => {
    try {
      const response = await fetch(`${API_BASE}/shelves`)
      const data = await response.json()
      setShelves(data)
      if (data.length > 0 && !selectedShelf) {
        setSelectedShelf(data[0])
      } else if (data.length === 0) {
        setSelectedShelf(null)
      }
    } catch (error) {
      console.error('Error loading shelves:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImportData = async () => {
    if (!confirm('This will import all data from shelvesData.js. Continue?')) return
    try {
      const response = await fetch(`${API_BASE}/import`, {
        method: 'POST'
      })
      if (response.ok) {
        alert('Data imported successfully!')
        await loadShelves()
      } else {
        alert('Error importing data')
      }
    } catch (error) {
      console.error('Error importing data:', error)
      alert('Error importing data')
    }
  }

  const handleShelfSelect = (shelf) => {
    setSelectedShelf(shelf)
    setSelectedProduct(null)
    setShowProductForm(false)
    setShowMobileMenu(false)
  }

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setShowProductForm(true)
  }

  const handleSaveProduct = async (productData) => {
    try {
      if (selectedProduct) {
        await fetch(`${API_BASE}/products/${selectedShelf.id}/${selectedProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
      } else {
        await fetch(`${API_BASE}/products/${selectedShelf.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
      }
      await loadShelves()
      setShowProductForm(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await fetch(`${API_BASE}/products/${selectedShelf.id}/${productId}`, {
        method: 'DELETE'
      })
      await loadShelves()
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const handleDeleteShelf = async (shelfId) => {
    if (!confirm('Are you sure you want to delete this shelf? All products will be deleted.')) return
    try {
      await fetch(`${API_BASE}/shelves/${shelfId}`, {
        method: 'DELETE'
      })
      await loadShelves()
      setSelectedShelf(null)
    } catch (error) {
      console.error('Error deleting shelf:', error)
      alert('Error deleting shelf')
    }
  }

  const handleSaveShelf = async (shelfData) => {
    try {
      // Ensure items array exists
      if (!shelfData.items) {
        shelfData.items = []
      }

      let savedShelf
      if (selectedShelf && selectedShelf.id === shelfData.id) {
        // Update existing shelf
        const response = await fetch(`${API_BASE}/shelves/${selectedShelf.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shelfData)
        })
        savedShelf = await response.json()
      } else {
        // Create new shelf
        const response = await fetch(`${API_BASE}/shelves`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shelfData)
        })
        savedShelf = await response.json()
      }
      
      await loadShelves()
      
      // Select the newly created/updated shelf
      if (savedShelf && savedShelf.id) {
        const updatedShelves = await fetch(`${API_BASE}/shelves`).then(r => r.json())
        const newShelf = updatedShelves.find(s => s.id === savedShelf.id)
        if (newShelf) {
          setSelectedShelf(newShelf)
        }
      }
      
      setShowShelfForm(false)
    } catch (error) {
      console.error('Error saving shelf:', error)
      alert('Error saving shelf: ' + (error.message || 'Unknown error'))
    }
  }

  const filteredProducts = selectedShelf?.items?.filter(product => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      product.title?.toLowerCase().includes(query) ||
      product.details?.toLowerCase().includes(query) ||
      product.eyebrow?.toLowerCase().includes(query) ||
      product.partNumber?.toLowerCase().includes(query)
    )
  }) || []

  if (loading) {
    return <div className="admin-loading">Loading...</div>
  }

  return (
    <div className="admin-app">
      <div className={`admin-sidebar ${showMobileMenu ? 'mobile-open' : ''}`}>
        <div className="admin-header">
          <div className="admin-header-top">
            <h1><i className="fas fa-store"></i> Shop Admin</h1>
            <button className="btn-icon mobile-close" onClick={() => setShowMobileMenu(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="admin-actions">
            <button className="btn-secondary btn-small" onClick={handleImportData}>
              <i className="fas fa-download"></i> Import Data
            </button>
            <button className="btn-primary btn-small" onClick={() => setShowShelfForm(true)}>
              <i className="fas fa-plus"></i> New Shelf
            </button>
            {onLogout && (
              <button 
                className="btn-danger btn-small" 
                onClick={() => {
                  if (confirm('Are you sure you want to logout?')) {
                    onLogout()
                  }
                }}
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            )}
          </div>
        </div>
        <div className="shelf-list">
          {shelves.length === 0 ? (
            <div className="empty-state">
              <p>No shelves yet</p>
              <button className="btn-primary" onClick={() => setShowShelfForm(true)}>
                Create First Shelf
              </button>
            </div>
          ) : (
            shelves.map(shelf => (
              <div
                key={shelf.id}
                className={`shelf-item ${selectedShelf?.id === shelf.id ? 'active' : ''}`}
                onClick={() => handleShelfSelect(shelf)}
              >
                <div className="shelf-item-content">
                  <h3><i className="fas fa-box"></i> {shelf.title}</h3>
                  <span className="product-count">{shelf.items?.length || 0} products</span>
                </div>
                <button
                  className="btn-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteShelf(shelf.id)
                  }}
                  title="Delete shelf"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="admin-main">
        {selectedShelf ? (
          <>
            <div className="admin-header-section">
              <div className="admin-header-top-section">
                <button className="btn-icon mobile-menu-btn" onClick={() => setShowMobileMenu(true)}>
                  <i className="fas fa-bars"></i>
                </button>
                <div>
                  <h2>{selectedShelf.title}</h2>
                  {selectedShelf.secondaryTitle && (
                    <p className="secondary-title">{selectedShelf.secondaryTitle}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="product-chat-list">
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-search" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}></i>
                  <p>{searchQuery ? 'No products found' : 'No products in this shelf'}</p>
                  {!searchQuery && (
                    <button className="btn-primary" onClick={() => {
                      setSelectedProduct(null)
                      setShowProductForm(true)
                    }}>
                      Add First Product
                    </button>
                  )}
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="product-chat-item"
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="product-avatar">
                      <img src={product.image || 'https://via.placeholder.com/300'} alt={product.imageAlt || product.title} />
                    </div>
                    <div className="product-chat-content">
                      <div className="product-chat-header">
                        <h3 className="product-chat-name" dangerouslySetInnerHTML={{ __html: product.title || 'Untitled' }}></h3>
                        <div className="product-chat-actions">
                          <button
                            className="btn-icon-chat"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleProductSelect(product)
                            }}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn-icon-chat btn-icon-danger"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteProduct(product.id)
                            }}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <p className="product-chat-preview">{product.details || 'No details available'}</p>
                      {product.partNumber && (
                        <span className="product-chat-meta">
                          <i className="fas fa-barcode"></i> {product.partNumber}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </>
        ) : (
          <div className="empty-state-large">
            <i className="fas fa-inbox" style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}></i>
            <h2>Select a shelf to manage products</h2>
            <p>Or create a new shelf to get started</p>
          </div>
        )}

        {/* WhatsApp-style Bottom Navigation - Always visible */}
        <div className="whatsapp-bottom-nav">
          <button 
            className={`nav-icon-btn ${showSearchOverlay || searchQuery ? 'active' : ''}`}
            onClick={() => {
              if (!selectedShelf) {
                alert('Please select a shelf first to search products')
                return
              }
              setShowSearchOverlay(!showSearchOverlay)
              if (showSearchOverlay) {
                setSearchQuery('')
              } else {
                setTimeout(() => {
                  const searchInput = document.querySelector('.search-input-mobile')
                  if (searchInput) searchInput.focus()
                }, 100)
              }
            }}
            title="Search"
            disabled={!selectedShelf}
          >
            <i className="fas fa-search"></i>
          </button>
          <button 
            className="nav-icon-btn"
            onClick={() => {
              if (!selectedShelf) {
                alert('Please select a shelf first to add products')
                return
              }
              setSelectedProduct(null)
              setShowProductForm(true)
            }}
            title="New Product"
            disabled={!selectedShelf}
          >
            <i className="fas fa-plus"></i>
          </button>
          <button 
            className="nav-icon-btn"
            onClick={() => {
              setSelectedShelf(null) // Clear selection when creating new shelf
              setShowShelfForm(true)
            }}
            title="New Shelf"
          >
            <i className="fas fa-folder-plus"></i>
          </button>
          <button 
            className="nav-icon-btn"
            onClick={handleImportData}
            title="Import Data"
          >
            <i className="fas fa-download"></i>
          </button>
        </div>

        {/* Mobile Search Overlay */}
        {selectedShelf && (
          <div className={`mobile-search-overlay ${showSearchOverlay ? 'active' : ''}`}>
            <div className="mobile-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="search-input-mobile"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  // Keep overlay open if there's text
                  if (!searchQuery) {
                    setTimeout(() => setShowSearchOverlay(false), 200)
                  }
                }}
              />
              <button className="btn-icon" onClick={() => {
                setSearchQuery('')
                setShowSearchOverlay(false)
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {showProductForm && (
        <ProductForm
          product={selectedProduct}
          shelf={selectedShelf}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowProductForm(false)
            setSelectedProduct(null)
          }}
        />
      )}

      {showShelfForm && (
        <ShelfForm
          shelf={selectedShelf}
          onSave={handleSaveShelf}
          onClose={() => setShowShelfForm(false)}
        />
      )}
    </div>
  )
}

const ProductForm = ({ product, shelf, onSave, onClose }) => {
  const createInitialState = () => ({
    id: product?.id || '',
    type: product?.type || 'hcard',
    cardSize: product?.cardSize || '40',
    eyebrow: product?.eyebrow || '',
    title: product?.title || '',
    image: product?.image || '',
    imageAlt: product?.imageAlt || '',
    primaryButtonText: product?.primaryButtonText || 'Buy',
    primaryButtonLink: '#', // Always use WhatsApp
    secondaryButtonText: product?.secondaryButtonText || '',
    secondaryButtonLink: product?.secondaryButtonLink || '',
    partNumber: product?.partNumber || '',
    details: product?.details || '',
    tag: product?.tag || '',
    colors: product?.colors || []
  })

  const [formData, setFormData] = useState(createInitialState)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.image || '')

  useEffect(() => {
    setFormData(createInitialState())
    setImagePreview(product?.image || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setImagePreview(base64String)
        setFormData({ ...formData, image: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-box"></i> {product ? 'Edit Product' : 'New Product'}</h2>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label><i className="fas fa-hashtag"></i> ID *</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., iphone-17-pro"
                required
              />
              <small><i className="fas fa-info-circle"></i> Unique identifier for the product (used internally, lowercase, no spaces)</small>
            </div>
            <div className="form-group">
              <label><i className="fas fa-tag"></i> Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="hcard">Hero Card</option>
                <option value="ccard">Content Card</option>
              </select>
            </div>
            <div className="form-group">
              <label><i className="fas fa-expand"></i> Card Size</label>
              <select
                value={formData.cardSize}
                onChange={(e) => setFormData({ ...formData, cardSize: e.target.value })}
              >
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
              </select>
              <small><i className="fas fa-info-circle"></i> Visual size class for the product card (40 = compact, 50 = medium, 60 = large)</small>
            </div>
          </div>

          <div className="form-group">
            <label><i className="fas fa-heading"></i> Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., iPhone 17 Pro"
              required
            />
            <small>HTML allowed (use &lt;br&gt; for line breaks)</small>
          </div>

          <div className="form-group">
            <label><i className="fas fa-image"></i> Image *</label>
            <div className="image-upload-section">
              <div className="image-upload-controls">
                <label className="btn-upload">
                  <i className="fas fa-upload"></i> Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <span className="upload-or">or</span>
                <input
                  type="url"
                  placeholder="Enter image URL"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value })
                    setImagePreview(e.target.value)
                  }}
                  className="image-url-input"
                />
              </div>
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="btn-icon btn-remove-image"
                    onClick={() => {
                      setImagePreview('')
                      setFormData({ ...formData, image: '' })
                      setImageFile(null)
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label><i className="fas fa-info-circle"></i> Image Alt Text</label>
            <input
              type="text"
              value={formData.imageAlt}
              onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><i className="fas fa-star"></i> Eyebrow</label>
              <input
                type="text"
                value={formData.eyebrow}
                onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                placeholder="e.g., NEW, BEST SELLER"
              />
            </div>
            <div className="form-group">
              <label><i className="fas fa-tag"></i> Tag</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g., orange, blue"
              />
            </div>
          </div>

          <div className="form-group">
            <label><i className="fas fa-info"></i> Details</label>
            <input
              type="text"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="e.g., 6.1 inch display"
            />
          </div>

          <div className="form-group">
            <label><i className="fas fa-barcode"></i> Part Number <span className="optional-badge">Optional</span></label>
            <input
              type="text"
              value={formData.partNumber}
              onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
              placeholder="e.g., MFXG4, IPHONE-17-PRO"
            />
            <small><i className="fas fa-info-circle"></i> Manufacturer's part number or SKU (for inventory tracking)</small>
          </div>

          <div className="form-group">
            <label><i className="fas fa-shopping-cart"></i> Primary Button Text</label>
            <input
              type="text"
              value={formData.primaryButtonText}
              onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
              placeholder="e.g., Buy, Order Now"
            />
            <small>Text shown on the main "Buy" button (always opens WhatsApp chat)</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><i className="fas fa-eye"></i> Secondary Button Text <span className="optional-badge">Optional</span></label>
              <input
                type="text"
                value={formData.secondaryButtonText}
                onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                placeholder="e.g., Learn More, View Details"
              />
              <small><i className="fas fa-info-circle"></i> Optional second button below the product (e.g., "Take a closer look")</small>
            </div>
            <div className="form-group">
              <label><i className="fas fa-external-link-alt"></i> Secondary Button Link <span className="optional-badge">Optional</span></label>
              <input
                type="url"
                value={formData.secondaryButtonLink}
                onChange={(e) => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
                placeholder="https://example.com/details"
              />
              <small><i className="fas fa-info-circle"></i> Link for the secondary button (only used if secondary button text is provided)</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              <i className="fas fa-times"></i> Cancel
            </button>
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i> Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ShelfForm = ({ shelf, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: shelf?.id || '',
    title: shelf?.title || '',
    secondaryTitle: shelf?.secondaryTitle || '',
    items: shelf?.items || []
  })
  const [errors, setErrors] = useState({})

  const generateShelfId = (title) => {
    if (!title) return ''
    return 'shelf-' + title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    // Auto-generate ID if not provided and it's a new shelf
    if (!shelf && !formData.id.trim()) {
      if (formData.title.trim()) {
        formData.id = generateShelfId(formData.title)
      } else {
        newErrors.id = 'ID is required or provide a title to auto-generate'
      }
    }

    // Validate ID format
    if (formData.id && !/^[a-z0-9-]+$/.test(formData.id)) {
      newErrors.id = 'ID can only contain lowercase letters, numbers, and hyphens'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    
    // Ensure items array exists
    const dataToSave = {
      ...formData,
      items: formData.items || []
    }
    
    onSave(dataToSave)
  }

  // Auto-generate ID when title changes (only for new shelves)
  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setFormData(prev => {
      const newData = { ...prev, title: newTitle }
      // Auto-generate ID if it's a new shelf and ID is empty
      if (!shelf && !prev.id) {
        newData.id = generateShelfId(newTitle)
      }
      return newData
    })
    // Clear title error when user types
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }))
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-box"></i> {shelf ? 'Edit Shelf' : 'New Shelf'}</h2>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="shelf-form">
          <div className="form-group">
            <label><i className="fas fa-heading"></i> Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g., iPhone, Samsung, MacBook"
              required
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
            <small>Main title of the shelf (e.g., "iPhone"). ID will be auto-generated.</small>
          </div>
          <div className="form-group">
            <label><i className="fas fa-hashtag"></i> ID *</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => {
                setFormData({ ...formData, id: e.target.value })
                if (errors.id) {
                  setErrors(prev => ({ ...prev, id: '' }))
                }
              }}
              placeholder="e.g., shelf-iphone (auto-generated from title)"
              required
              disabled={!shelf && !!formData.title} // Disable if auto-generating
              className={errors.id ? 'error' : ''}
            />
            {errors.id && <span className="error-message">{errors.id}</span>}
            <small>Unique identifier (auto-generated from title, or customize manually)</small>
          </div>
          <div className="form-group">
            <label><i className="fas fa-subscript"></i> Secondary Title <span className="optional-badge">Optional</span></label>
            <input
              type="text"
              value={formData.secondaryTitle}
              onChange={(e) => setFormData({ ...formData, secondaryTitle: e.target.value })}
              placeholder="e.g., The latest from Apple."
            />
            <small>Optional subtitle that appears below the main title</small>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              <i className="fas fa-times"></i> Cancel
            </button>
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i> Save Shelf
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminApp
