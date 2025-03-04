import React, { useState } from 'react';
import { TOOLBAR_GROUPS } from '../../constants/toolbarItems';
import './Toolbar.css';

const Toolbar = (props) => {
  const [activeButtons, setActiveButtons] = useState({});

  // ボタンのトグル状態を切り替える
  const toggleButtonState = (buttonId, group = null) => {
    setActiveButtons(prev => {
      // グループが指定されている場合、同じグループの他のボタンをオフにする
      if (group) {
        const newState = { ...prev };
        
        // 同じグループのすべてのボタンをオフにする
        Object.keys(newState).forEach(key => {
          if (newState[key].group === group) {
            newState[key].active = false;
          }
        });
        
        // 現在のボタンをトグル
        newState[buttonId] = {
          active: !prev[buttonId]?.active,
          group
        };
        
        return newState;
      }
      
      // グループなしの場合は単純にトグル
      return {
        ...prev,
        [buttonId]: {
          active: !prev[buttonId]?.active
        }
      };
    });
  };

  // ツールバーボタンのクリックハンドラー
  const handleButtonClick = (button) => {
    // アクションを実行
    if (button.action && typeof props[button.action] === 'function') {
      props[button.action]();
    }
    
    // トグル可能なボタンの場合、状態を更新
    if (button.toggleable) {
      toggleButtonState(button.id, button.group);
    }
  };

  // ツールバーボタンをレンダリング
  const renderToolbarButton = (button) => {
    const isActive = activeButtons[button.id]?.active;
    
    return (
      <button
        key={button.id}
        className={`toolbar-button ${isActive ? 'active' : ''}`}
        title={button.tooltip}
        onClick={() => handleButtonClick(button)}
      >
        <span className="toolbar-icon">{button.icon}</span>
      </button>
    );
  };

  return (
    <div className="toolbar">
      {TOOLBAR_GROUPS.map((group) => (
        <div key={group.id} className="toolbar-group">
          {group.items.map(renderToolbarButton)}
        </div>
      ))}
    </div>
  );
};

export default Toolbar;