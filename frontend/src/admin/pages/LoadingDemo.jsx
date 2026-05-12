import React, { useState } from 'react';
import FoodLoadingAnimation from '../components/FoodLoadingAnimation';

export default function LoadingDemo() {
  const [selectedType, setSelectedType] = useState('utensils');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [customText, setCustomText] = useState('Loading delicious data...');
  const [fullScreen, setFullScreen] = useState(false);

  const animationTypes = [
    { value: 'utensils', label: 'Utensils (Fork, Knife, Spoon)' },
    { value: 'plates', label: 'Plates (Spinning Plates)' },
    { value: 'chef', label: 'Chef (Chef with Hat)' },
    { value: 'ingredients', label: 'Ingredients (Food Emojis)' }
  ];

  const sizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Loading Animation Demo</h2>
          <p className="ad_p">Interactive showcase of food-themed loading animations</p>
        </div>
      </div>

      {/* Controls */}
      <div className="ad_card" style={{ marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--ad-text-1)', marginBottom: '16px' }}>Animation Controls</h3>
        
        <div className="ad_form_grid">
          <div>
            <label style={{ display: 'block', color: 'var(--ad-text-2)', marginBottom: '6px', fontSize: '14px' }}>
              Animation Type
            </label>
            <select 
              className="ad_select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {animationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--ad-text-2)', marginBottom: '6px', fontSize: '14px' }}>
              Size
            </label>
            <select 
              className="ad_select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {sizes.map(size => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--ad-text-2)', marginBottom: '6px', fontSize: '14px' }}>
              Custom Text
            </label>
            <input 
              className="ad_input"
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Loading delicious data..."
            />
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--ad-text-2)', marginBottom: '6px', fontSize: '14px' }}>
              Full Screen
            </label>
            <select 
              className="ad_select"
              value={fullScreen.toString()}
              onChange={(e) => setFullScreen(e.target.value === 'true')}
            >
              <option value="false">Inline</option>
              <option value="true">Full Screen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="ad_card">
        <h3 style={{ color: 'var(--ad-text-1)', marginBottom: '16px' }}>Preview</h3>
        
        <div style={{ 
          border: '1px solid var(--ad-border-soft)', 
          borderRadius: 'var(--ad-r-md)', 
          padding: '40px',
          background: 'var(--ad-surface)',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FoodLoadingAnimation 
            type={selectedType}
            size={selectedSize}
            text={customText}
            fullScreen={fullScreen}
          />
        </div>
      </div>

      {/* All Animations Showcase */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ color: 'var(--ad-text-1)', marginBottom: '16px' }}>All Animation Types</h3>
        
        <div className="ad_two_col">
          {animationTypes.map(type => (
            <div key={type.value} className="ad_card">
              <h4 style={{ color: 'var(--ad-gold-light)', marginBottom: '12px', fontSize: '16px' }}>
                {type.label}
              </h4>
              <div style={{ 
                padding: '30px',
                background: 'var(--ad-surface)',
                borderRadius: 'var(--ad-r-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px'
              }}>
                <FoodLoadingAnimation 
                  type={type.value}
                  size="small"
                  text=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Examples */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ color: 'var(--ad-text-1)', marginBottom: '16px' }}>Usage Examples</h3>
        
        <div className="ad_card" style={{ marginBottom: '16px' }}>
          <h4 style={{ color: 'var(--ad-gold-light)', marginBottom: '12px' }}>Basic Import</h4>
          <pre style={{ 
            background: 'var(--ad-bg)', 
            padding: '12px', 
            borderRadius: 'var(--ad-r-sm)',
            color: 'var(--ad-text-2)',
            fontSize: '13px',
            overflow: 'auto'
          }}>
{`import FoodLoadingAnimation from '../components/FoodLoadingAnimation';`}
          </pre>
        </div>

        <div className="ad_card" style={{ marginBottom: '16px' }}>
          <h4 style={{ color: 'var(--ad-gold-light)', marginBottom: '12px' }}>In Table Loading</h4>
          <pre style={{ 
            background: 'var(--ad-bg)', 
            padding: '12px', 
            borderRadius: 'var(--ad-r-sm)',
            color: 'var(--ad-text-2)',
            fontSize: '13px',
            overflow: 'auto'
          }}>
{`{loading ? (
  <tr>
    <td colSpan="7" style={{ padding: "40px" }}>
      <FoodLoadingAnimation 
        type="utensils" 
        size="medium" 
        text="Loading reservations..." 
      />
    </td>
  </tr>
) : (
  // Your table content
)}`}
          </pre>
        </div>

        <div className="ad_card">
          <h4 style={{ color: 'var(--ad-gold-light)', marginBottom: '12px' }}>Full Screen Loading</h4>
          <pre style={{ 
            background: 'var(--ad-bg)', 
            padding: '12px', 
            borderRadius: 'var(--ad-r-sm)',
            color: 'var(--ad-text-2)',
            fontSize: '13px',
            overflow: 'auto'
          }}>
{`{loading && (
  <FoodLoadingAnimation 
    type="chef" 
    size="large" 
    text="Loading data..." 
    fullScreen={true}
  />
)}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
