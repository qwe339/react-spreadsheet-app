import React, { useState, useEffect, useRef } from 'react';
import { ALL_MENUS } from '../../constants/menuItems';
import { formatShortcut, getShortcutByAction } from '../../constants/shortcutKeys';
import './MenuBar.css';

const MenuBar = (props) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuBarRef = useRef(null);

  // メニューを開く・閉じる
  const handleMenuClick = (menuId) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
    }
  };

  // メニュー項目をクリック
  const handleMenuItemClick = (itemId, action) => {
    setActiveMenu(null);
    
    // 対応するアクションがpropsに含まれていれば実行
    if (typeof props[action] === 'function') {
      props[action]();
    }
  };

  // メニュー外をクリックしたときにメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuBarRef.current && !menuBarRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    // アクティブなメニューがある場合のみイベントリスナーを追加
    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  // ショートカットの表示フォーマット
  const renderShortcut = (actionName) => {
    const shortcut = getShortcutByAction(actionName);
    if (!shortcut) return null;
    
    return (
      <span className="menu-shortcut">{formatShortcut(shortcut)}</span>
    );
  };

  // メニュー項目のレンダリング
  const renderMenuItem = (item) => {
    // セパレーター
    if (item.type === 'separator') {
      return <div key={`separator-${Math.random()}`} className="menu-separator"></div>;
    }

    // チェック可能なメニュー項目
    if (item.checkable) {
      return (
        <div
          key={item.id}
          className={`menu-item ${item.checked ? 'checked' : ''}`}
          onClick={() => handleMenuItemClick(item.id, item.action)}
        >
          <span className="menu-item-check">{item.checked ? '✓' : ''}</span>
          <span className="menu-item-label">{item.label}</span>
          {renderShortcut(item.action)}
        </div>
      );
    }

    // 通常のメニュー項目
    return (
      <div
        key={item.id}
        className="menu-item"
        onClick={() => handleMenuItemClick(item.id, item.action)}
      >
        {item.icon && <span className="menu-item-icon">{item.icon}</span>}
        <span className="menu-item-label">{item.label}</span>
        {renderShortcut(item.action)}
      </div>
    );
  };

  return (
    <div className="menu-bar" ref={menuBarRef}>
      {ALL_MENUS.map((menu) => (
        <div key={menu.id} className="menu-container">
          <div
            className={`menu-title ${activeMenu === menu.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(menu.id)}
          >
            {menu.label}
          </div>
          {activeMenu === menu.id && (
            <div className="menu-dropdown">
              {menu.items.map(renderMenuItem)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuBar;