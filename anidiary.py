import customtkinter as ctk
from datetime import datetime
import tkinter.messagebox as messagebox
import json
import os
import sys
import tempfile
from PIL import Image
import tkinter as tk

# تنظیمات اولیه
ctk.set_appearance_mode("dark")

# ==================== ۱۰۰+ تم ترکیبی زیبا ====================
THEMES = {}

# دسته اول: رنگین‌کمانی
rainbow_themes = {
    "🌈 Rainbow Dream": {"primary": "#FF6B6B", "secondary": "#4ECDC4", "accent": "#FFE66D", "bg": "#1A1A2E", "card": "#16213E", "text": "#FFFFFF", "text_secondary": "#C0C0C0", "button_hover": "#FF6B6B", "border": "#4ECDC4"},
    "🌈 Pastel Rainbow": {"primary": "#FFB7B2", "secondary": "#B5EAD7", "accent": "#C7CEEA", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#FFF0F5", "text_secondary": "#FFB7B2", "button_hover": "#C7CEEA", "border": "#B5EAD7"},
    "🌈 Neon Nights": {"primary": "#FF00FF", "secondary": "#00FFFF", "accent": "#FFFF00", "bg": "#0A0A0A", "card": "#1A1A1A", "text": "#00FF00", "text_secondary": "#FF00FF", "button_hover": "#FFFF00", "border": "#00FFFF"},
    "🌈 Cotton Candy": {"primary": "#FF9FF3", "secondary": "#FECA57", "accent": "#FF6B6B", "bg": "#1E1B2E", "card": "#2D2B3E", "text": "#FFF0F5", "text_secondary": "#FF9FF3", "button_hover": "#FECA57", "border": "#FF6B6B"},
    "🌈 Aurora": {"primary": "#00B894", "secondary": "#6C5CE7", "accent": "#FDCB6E", "bg": "#1A2F2B", "card": "#2A3F3B", "text": "#DFF6F0", "text_secondary": "#6C5CE7", "button_hover": "#FDCB6E", "border": "#00B894"},
    "🌈 Tropical": {"primary": "#FF6B6B", "secondary": "#FFE66D", "accent": "#4ECDC4", "bg": "#1A2F2B", "card": "#2A3F3B", "text": "#FFFFFF", "text_secondary": "#FFE66D", "button_hover": "#4ECDC4", "border": "#FF6B6B"},
    "🌈 Galaxy": {"primary": "#6C5CE7", "secondary": "#A29BFE", "accent": "#00CEC9", "bg": "#1E1B2E", "card": "#2D2B3E", "text": "#E0E0FF", "text_secondary": "#A29BFE", "button_hover": "#00CEC9", "border": "#6C5CE7"},
    "🌈 Sunset": {"primary": "#FF4757", "secondary": "#FFA502", "accent": "#7B2CBF", "bg": "#1A1A2E", "card": "#16213E", "text": "#FFFFFF", "text_secondary": "#FFA502", "button_hover": "#7B2CBF", "border": "#FF4757"},
    "🌈 Ocean": {"primary": "#0984E3", "secondary": "#74B9FF", "accent": "#00CEC9", "bg": "#0F172A", "card": "#1E293B", "text": "#E2E8F0", "text_secondary": "#74B9FF", "button_hover": "#00CEC9", "border": "#0984E3"},
    "🌈 Forest": {"primary": "#00B894", "secondary": "#55EFC4", "accent": "#FDCB6E", "bg": "#1A2F2B", "card": "#2A3F3B", "text": "#DFF6F0", "text_secondary": "#55EFC4", "button_hover": "#FDCB6E", "border": "#00B894"},
}

# دسته دوم: صورتی
pink_themes = {
    "🌸 Sakura Dream": {"primary": "#FF69B4", "secondary": "#FFB6C1", "accent": "#FF1493", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#FFF0F5", "text_secondary": "#FFB6C1", "button_hover": "#FF1493", "border": "#FF69B4"},
    "🌸 Pink Blossom": {"primary": "#FFB7C5", "secondary": "#FFC0CB", "accent": "#FF69B4", "bg": "#2D1B25", "card": "#3D2B35", "text": "#FFE4E8", "text_secondary": "#FFB7C5", "button_hover": "#FF69B4", "border": "#FFC0CB"},
    "🌸 Bubblegum": {"primary": "#FF85A1", "secondary": "#FFB8C6", "accent": "#FF4D6D", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#FFFFFF", "text_secondary": "#FFB8C6", "button_hover": "#FF4D6D", "border": "#FF85A1"},
    "🌸 Strawberry": {"primary": "#FF5E7E", "secondary": "#FF9AAD", "accent": "#E84393", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#FFE4E8", "text_secondary": "#FF9AAD", "button_hover": "#E84393", "border": "#FF5E7E"},
    "🌸 Rose Garden": {"primary": "#E84393", "secondary": "#FD79A8", "accent": "#6C5CE7", "bg": "#2D1B2E", "card": "#3D2B4E", "text": "#FFF0F5", "text_secondary": "#FD79A8", "button_hover": "#6C5CE7", "border": "#E84393"},
    "🌸 Cherry": {"primary": "#FF1493", "secondary": "#FF69B4", "accent": "#00CEC9", "bg": "#1E1B2E", "card": "#2D2B3E", "text": "#FFE4E8", "text_secondary": "#FF69B4", "button_hover": "#00CEC9", "border": "#FF1493"},
    "🌸 Peony": {"primary": "#FF6B8B", "secondary": "#FF9EC4", "accent": "#FFD700", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#FFF5F5", "text_secondary": "#FF9EC4", "button_hover": "#FFD700", "border": "#FF6B8B"},
    "🌸 Tulip": {"primary": "#FF7F7F", "secondary": "#FFB3B3", "accent": "#FF4D4D", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#FFFFFF", "text_secondary": "#FFB3B3", "button_hover": "#FF4D4D", "border": "#FF7F7F"},
    "🌸 Lotus": {"primary": "#FF99CC", "secondary": "#FFCCE5", "accent": "#FF66B2", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#FFF0F5", "text_secondary": "#FFCCE5", "button_hover": "#FF66B2", "border": "#FF99CC"},
    "🌸 Magnolia": {"primary": "#FFB3D9", "secondary": "#FFD9F0", "accent": "#FF80BF", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#FFF5FA", "text_secondary": "#FFD9F0", "button_hover": "#FF80BF", "border": "#FFB3D9"},
}

# دسته سوم: بنفش
purple_themes = {
    "💜 Purple Rain": {"primary": "#9B59B6", "secondary": "#D4A5E5", "accent": "#3498DB", "bg": "#1A1A2E", "card": "#2C2C3E", "text": "#F3E5F5", "text_secondary": "#D4A5E5", "button_hover": "#3498DB", "border": "#9B59B6"},
    "💜 Violet Storm": {"primary": "#6C5CE7", "secondary": "#A29BFE", "accent": "#FD79A8", "bg": "#1E1B2E", "card": "#2D2B3E", "text": "#E0E0FF", "text_secondary": "#A29BFE", "button_hover": "#FD79A8", "border": "#6C5CE7"},
    "💜 Lavender": {"primary": "#C39BD3", "secondary": "#E8DAEF", "accent": "#A569BD", "bg": "#1E1A25", "card": "#2E2A35", "text": "#F5EEF8", "text_secondary": "#C39BD3", "button_hover": "#A569BD", "border": "#C39BD3"},
    "💜 Deep Purple": {"primary": "#8E44AD", "secondary": "#D2B4DE", "accent": "#F39C12", "bg": "#1A1A2E", "card": "#2C2C3E", "text": "#F4ECF7", "text_secondary": "#D2B4DE", "button_hover": "#F39C12", "border": "#8E44AD"},
    "💜 Orchid": {"primary": "#AF7AC5", "secondary": "#D7BDE2", "accent": "#E74C3C", "bg": "#1A1A2E", "card": "#2C2C3E", "text": "#F5EEF8", "text_secondary": "#D7BDE2", "button_hover": "#E74C3C", "border": "#AF7AC5"},
    "💜 Amethyst": {"primary": "#9B59B6", "secondary": "#C39BD3", "accent": "#2ECC71", "bg": "#1E1B2E", "card": "#2D2B3E", "text": "#F3E5F5", "text_secondary": "#C39BD3", "button_hover": "#2ECC71", "border": "#9B59B6"},
    "💜 Lilac": {"primary": "#B39CD0", "secondary": "#D4C1E0", "accent": "#FF6B6B", "bg": "#1E1A2E", "card": "#2E2A3E", "text": "#F2EBF9", "text_secondary": "#D4C1E0", "button_hover": "#FF6B6B", "border": "#B39CD0"},
    "💜 Mauve": {"primary": "#A569BD", "secondary": "#C39BD3", "accent": "#FDCB6E", "bg": "#1A1A2E", "card": "#2C2C3E", "text": "#F5EEF8", "text_secondary": "#C39BD3", "button_hover": "#FDCB6E", "border": "#A569BD"},
    "💜 Plum": {"primary": "#884EA0", "secondary": "#B977A6", "accent": "#48C9B0", "bg": "#1A1A2E", "card": "#2C2C3E", "text": "#F4ECF7", "text_secondary": "#B977A6", "button_hover": "#48C9B0", "border": "#884EA0"},
    "💜 Wisteria": {"primary": "#CD92C9", "secondary": "#E2B6DF", "accent": "#3498DB", "bg": "#1E1B2E", "card": "#2D2B3E", "text": "#F9F0F8", "text_secondary": "#E2B6DF", "button_hover": "#3498DB", "border": "#CD92C9"},
}

# دسته چهارم: آبی
blue_themes = {
    "💙 Ocean Breeze": {"primary": "#0984E3", "secondary": "#74B9FF", "accent": "#00CEC9", "bg": "#0F172A", "card": "#1E293B", "text": "#E2E8F0", "text_secondary": "#74B9FF", "button_hover": "#00CEC9", "border": "#0984E3"},
    "💙 Sky Blue": {"primary": "#3498DB", "secondary": "#85C1E9", "accent": "#2980B9", "bg": "#1A252F", "card": "#2A3545", "text": "#EBF5FB", "text_secondary": "#85C1E9", "button_hover": "#2980B9", "border": "#3498DB"},
    "💙 Navy Blue": {"primary": "#2C3E50", "secondary": "#5D6D7E", "accent": "#1A5276", "bg": "#1B2631", "card": "#2B3B4E", "text": "#D6EAF8", "text_secondary": "#5D6D7E", "button_hover": "#1A5276", "border": "#2C3E50"},
    "💙 Arctic": {"primary": "#00CEC9", "secondary": "#81ECEC", "accent": "#FF6B6B", "bg": "#1A2F3A", "card": "#2A3F4A", "text": "#E8F6F3", "text_secondary": "#81ECEC", "button_hover": "#FF6B6B", "border": "#00CEC9"},
    "💙 Sapphire": {"primary": "#2471A3", "secondary": "#5DADE2", "accent": "#F1C40F", "bg": "#1A252F", "card": "#2A3545", "text": "#EAF2F8", "text_secondary": "#5DADE2", "button_hover": "#F1C40F", "border": "#2471A3"},
    "💙 Azure": {"primary": "#0077B6", "secondary": "#48CAE4", "accent": "#90E0EF", "bg": "#0F172A", "card": "#1E293B", "text": "#FFFFFF", "text_secondary": "#48CAE4", "button_hover": "#90E0EF", "border": "#0077B6"},
    "💙 Cyan": {"primary": "#00B4D8", "secondary": "#90E0EF", "accent": "#CAF0F8", "bg": "#0A0A1A", "card": "#1A1A2E", "text": "#FFFFFF", "text_secondary": "#90E0EF", "button_hover": "#CAF0F8", "border": "#00B4D8"},
    "💙 Denim": {"primary": "#1565C0", "secondary": "#64B5F6", "accent": "#FFA502", "bg": "#1A252F", "card": "#2A3545", "text": "#E3F2FD", "text_secondary": "#64B5F6", "button_hover": "#FFA502", "border": "#1565C0"},
    "💙 Teal": {"primary": "#008080", "secondary": "#20B2AA", "accent": "#FFD700", "bg": "#1A2F2F", "card": "#2A3F3F", "text": "#E0FFFF", "text_secondary": "#20B2AA", "button_hover": "#FFD700", "border": "#008080"},
    "💙 Indigo": {"primary": "#4B0082", "secondary": "#8A2BE2", "accent": "#FF6347", "bg": "#1E1A2E", "card": "#2D2B3E", "text": "#E8D8F8", "text_secondary": "#8A2BE2", "button_hover": "#FF6347", "border": "#4B0082"},
}

# دسته پنجم: سبز
green_themes = {
    "💚 Forest Spirit": {"primary": "#00B894", "secondary": "#55EFC4", "accent": "#FDCB6E", "bg": "#1A2F2B", "card": "#2A3F3B", "text": "#DFF6F0", "text_secondary": "#55EFC4", "button_hover": "#FDCB6E", "border": "#00B894"},
    "💚 Mint Green": {"primary": "#1ABC9C", "secondary": "#48C9B0", "accent": "#F39C12", "bg": "#1A2F2F", "card": "#2A3F3F", "text": "#E8F8F5", "text_secondary": "#48C9B0", "button_hover": "#F39C12", "border": "#1ABC9C"},
    "💚 Emerald": {"primary": "#27AE60", "secondary": "#58D68D", "accent": "#F1C40F", "bg": "#1A2A1A", "card": "#2A3A2A", "text": "#E8F5E8", "text_secondary": "#58D68D", "button_hover": "#F1C40F", "border": "#27AE60"},
    "💚 Jade": {"primary": "#00A86B", "secondary": "#50C878", "accent": "#FFD700", "bg": "#1A2A1A", "card": "#2A3A2A", "text": "#E0F8E0", "text_secondary": "#50C878", "button_hover": "#FFD700", "border": "#00A86B"},
    "💚 Lime": {"primary": "#32CD32", "secondary": "#7CFC00", "accent": "#FF6347", "bg": "#1A2A1A", "card": "#2A3A2A", "text": "#F0FFF0", "text_secondary": "#7CFC00", "button_hover": "#FF6347", "border": "#32CD32"},
    "💚 Olive": {"primary": "#556B2F", "secondary": "#6B8E23", "accent": "#FFD700", "bg": "#1A2A1A", "card": "#2A3A2A", "text": "#FFFFE0", "text_secondary": "#6B8E23", "button_hover": "#FFD700", "border": "#556B2F"},
    "💚 Sea Green": {"primary": "#2E8B57", "secondary": "#3CB371", "accent": "#F4A460", "bg": "#1A2F2B", "card": "#2A3F3B", "text": "#F0FFF0", "text_secondary": "#3CB371", "button_hover": "#F4A460", "border": "#2E8B57"},
    "💚 Spring": {"primary": "#00FA9A", "secondary": "#7FFF00", "accent": "#FF69B4", "bg": "#1A2F2B", "card": "#2A3F3B", "text": "#F5FFFA", "text_secondary": "#7FFF00", "button_hover": "#FF69B4", "border": "#00FA9A"},
    "💚 Kelp": {"primary": "#2E8B57", "secondary": "#66CDAA", "accent": "#FFD700", "bg": "#1A2A1A", "card": "#2A3A2A", "text": "#E0F8F0", "text_secondary": "#66CDAA", "button_hover": "#FFD700", "border": "#2E8B57"},
    "💚 Clover": {"primary": "#228B22", "secondary": "#32CD32", "accent": "#FFA500", "bg": "#1A2A1A", "card": "#2A3A2A", "text": "#F0FFF0", "text_secondary": "#32CD32", "button_hover": "#FFA500", "border": "#228B22"},
}

# دسته ششم: قرمز و نارنجی
red_orange_themes = {
    "🔥 Phoenix Rise": {"primary": "#E74C3C", "secondary": "#F39C12", "accent": "#8E44AD", "bg": "#2D1A1A", "card": "#3D2A2A", "text": "#FDEDEC", "text_secondary": "#F39C12", "button_hover": "#8E44AD", "border": "#E74C3C"},
    "🔥 Sunset Fire": {"primary": "#E17055", "secondary": "#FDCB6E", "accent": "#00CEC9", "bg": "#2D1B1B", "card": "#3D2B2B", "text": "#FFEFDF", "text_secondary": "#FDCB6E", "button_hover": "#00CEC9", "border": "#E17055"},
    "🧡 Orange Dream": {"primary": "#F39C12", "secondary": "#F5B041", "accent": "#E67E22", "bg": "#2D1B15", "card": "#3D2B25", "text": "#FFF5E0", "text_secondary": "#F5B041", "button_hover": "#E67E22", "border": "#F39C12"},
    "❤️ Crimson": {"primary": "#E74C3C", "secondary": "#EC7063", "accent": "#C0392B", "bg": "#2D1A1A", "card": "#3D2A2A", "text": "#FDEDEC", "text_secondary": "#EC7063", "button_hover": "#C0392B", "border": "#E74C3C"},
    "🍂 Autumn": {"primary": "#E67E22", "secondary": "#F39C12", "accent": "#D35400", "bg": "#2C1A0E", "card": "#3C2A1E", "text": "#FFE0B5", "text_secondary": "#F39C12", "button_hover": "#D35400", "border": "#E67E22"},
    "🍁 Maple": {"primary": "#D35400", "secondary": "#E67E22", "accent": "#F1C40F", "bg": "#2D1A0E", "card": "#3D2A1E", "text": "#FFE4C4", "text_secondary": "#E67E22", "button_hover": "#F1C40F", "border": "#D35400"},
    "🌶️ Chili": {"primary": "#C0392B", "secondary": "#E74C3C", "accent": "#F39C12", "bg": "#2D1A1A", "card": "#3D2A2A", "text": "#FDEDEC", "text_secondary": "#E74C3C", "button_hover": "#F39C12", "border": "#C0392B"},
    "🍊 Tangerine": {"primary": "#FF8C00", "secondary": "#FFA500", "accent": "#FF4500", "bg": "#2D1B15", "card": "#3D2B25", "text": "#FFF5E0", "text_secondary": "#FFA500", "button_hover": "#FF4500", "border": "#FF8C00"},
    "🧡 Coral": {"primary": "#FF7F50", "secondary": "#FFA07A", "accent": "#FF6347", "bg": "#2D1B1B", "card": "#3D2B2B", "text": "#FFF0E8", "text_secondary": "#FFA07A", "button_hover": "#FF6347", "border": "#FF7F50"},
    "🔥 Flame": {"primary": "#FF4500", "secondary": "#FF6347", "accent": "#FF8C00", "bg": "#2D1A0E", "card": "#3D2A1E", "text": "#FFE4C4", "text_secondary": "#FF6347", "button_hover": "#FF8C00", "border": "#FF4500"},
}

# دسته هفتم: تم‌های فانتزی انیمه‌ای
anime_themes = {
    "🦄 Unicorn Magic": {"primary": "#FF9FF3", "secondary": "#FECA57", "accent": "#FF6B6B", "bg": "#1E1B2E", "card": "#2D2B3E", "text": "#FFF0F5", "text_secondary": "#FF9FF3", "button_hover": "#FECA57", "border": "#FF6B6B"},
    "🧚 Fairy Garden": {"primary": "#00B894", "secondary": "#FDCB6E", "accent": "#FF7675", "bg": "#1A2F2B", "card": "#2A3F3B", "text": "#DFF6F0", "text_secondary": "#FDCB6E", "button_hover": "#FF7675", "border": "#00B894"},
    "🎆 Fireworks": {"primary": "#FF4757", "secondary": "#FFA502", "accent": "#7B2CBF", "bg": "#1A1A2E", "card": "#16213E", "text": "#FFFFFF", "text_secondary": "#FFA502", "button_hover": "#7B2CBF", "border": "#FF4757"},
    "🌊 Mermaid": {"primary": "#1ABC9C", "secondary": "#FF9FF3", "accent": "#FECA57", "bg": "#1A2F3A", "card": "#2A3F4A", "text": "#E8F8F5", "text_secondary": "#FF9FF3", "button_hover": "#FECA57", "border": "#1ABC9C"},
    "⚡ Thunder": {"primary": "#6C5CE7", "secondary": "#00CEC9", "accent": "#FDCB6E", "bg": "#0F172A", "card": "#1E293B", "text": "#E2E8F0", "text_secondary": "#00CEC9", "button_hover": "#FDCB6E", "border": "#6C5CE7"},
    "🎌 Samurai": {"primary": "#D63031", "secondary": "#2C3E50", "accent": "#F39C12", "bg": "#1A1A1A", "card": "#2C2C2C", "text": "#ECF0F1", "text_secondary": "#F39C12", "button_hover": "#D63031", "border": "#D63031"},
    "🏯 Temple": {"primary": "#8E44AD", "secondary": "#D4A5E5", "accent": "#F39C12", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#F3E5F5", "text_secondary": "#D4A5E5", "button_hover": "#F39C12", "border": "#8E44AD"},
    "🗻 Fuji": {"primary": "#FF6B6B", "secondary": "#00CEC9", "accent": "#FDCB6E", "bg": "#1A252F", "card": "#2A3545", "text": "#E8F8F5", "text_secondary": "#FF6B6B", "button_hover": "#FDCB6E", "border": "#FF6B6B"},
    "🐉 Dragon": {"primary": "#E74C3C", "secondary": "#F39C12", "accent": "#27AE60", "bg": "#1A1A2E", "card": "#16213E", "text": "#E0E0E0", "text_secondary": "#F39C12", "button_hover": "#27AE60", "border": "#E74C3C"},
    "🌙 Moon": {"primary": "#B2BEC3", "secondary": "#F8F9FA", "accent": "#74B9FF", "bg": "#191E24", "card": "#2D343E", "text": "#F8F9FA", "text_secondary": "#B2BEC3", "button_hover": "#74B9FF", "border": "#B2BEC3"},
    "🎭 Kabuki": {"primary": "#E84393", "secondary": "#FD79A8", "accent": "#6C5CE7", "bg": "#2D1B2E", "card": "#3D2B4E", "text": "#FFF0F5", "text_secondary": "#FD79A8", "button_hover": "#6C5CE7", "border": "#E84393"},
    "🎪 Circus": {"primary": "#FF6B6B", "secondary": "#4ECDC4", "accent": "#FFE66D", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#FFF0F5", "text_secondary": "#FFE66D", "button_hover": "#4ECDC4", "border": "#FF6B6B"},
    "🏮 Festival": {"primary": "#E84393", "secondary": "#FF7675", "accent": "#FDCB6E", "bg": "#2D1B2E", "card": "#3D2B4E", "text": "#FFF0F5", "text_secondary": "#FDCB6E", "button_hover": "#FF7675", "border": "#E84393"},
    "🍜 Ramen": {"primary": "#E67E22", "secondary": "#F39C12", "accent": "#D35400", "bg": "#2D1B0E", "card": "#3D2B1E", "text": "#FFE0B5", "text_secondary": "#F39C12", "button_hover": "#D35400", "border": "#E67E22"},
    "⚡ Neon": {"primary": "#00FFD1", "secondary": "#FF00FF", "accent": "#FFFF00", "bg": "#0A0A0A", "card": "#1A1A1A", "text": "#00FFD1", "text_secondary": "#FF00FF", "button_hover": "#FFFF00", "border": "#00FFD1"},
}

# دسته هشتم: تم‌های کلاسیک
classic_themes = {
    "🤍 Pure White": {"primary": "#DFE6E9", "secondary": "#F5F5F5", "accent": "#74B9FF", "bg": "#ECEFF1", "card": "#FFFFFF", "text": "#2D3436", "text_secondary": "#636E72", "button_hover": "#74B9FF", "border": "#DFE6E9"},
    "🖤 Dark Metal": {"primary": "#636E72", "secondary": "#B2BEC3", "accent": "#DFE6E9", "bg": "#2D3436", "card": "#3D4446", "text": "#F5F5F5", "text_secondary": "#B2BEC3", "button_hover": "#DFE6E9", "border": "#636E72"},
    "🩶 Silver": {"primary": "#95A5A6", "secondary": "#BDC3C7", "accent": "#7F8C8D", "bg": "#2C3E50", "card": "#34495E", "text": "#ECF0F1", "text_secondary": "#BDC3C7", "button_hover": "#7F8C8D", "border": "#95A5A6"},
    "🤎 Brown Sugar": {"primary": "#A0522D", "secondary": "#CD853F", "accent": "#DEB887", "bg": "#2D1B0E", "card": "#3D2B1E", "text": "#FFF0E0", "text_secondary": "#CD853F", "button_hover": "#DEB887", "border": "#A0522D"},
    "⚪ Crystal": {"primary": "#E8DAEF", "secondary": "#F5EEF8", "accent": "#C39BD3", "bg": "#ECEFF1", "card": "#FFFFFF", "text": "#4A235A", "text_secondary": "#9B59B6", "button_hover": "#C39BD3", "border": "#E8DAEF"},
    "⬛ Obsidian": {"primary": "#2C3E50", "secondary": "#34495E", "accent": "#E74C3C", "bg": "#1A1A1A", "card": "#2C2C2C", "text": "#ECF0F1", "text_secondary": "#7F8C8D", "button_hover": "#E74C3C", "border": "#2C3E50"},
    "💎 Diamond": {"primary": "#B2BEC3", "secondary": "#DFE6E9", "accent": "#00CEC9", "bg": "#F5F5F5", "card": "#FFFFFF", "text": "#2D3436", "text_secondary": "#636E72", "button_hover": "#00CEC9", "border": "#B2BEC3"},
    "🏔️ Mountain": {"primary": "#5D6D7E", "secondary": "#AEB6BF", "accent": "#2ECC71", "bg": "#1A252F", "card": "#2A3545", "text": "#E8F8F5", "text_secondary": "#AEB6BF", "button_hover": "#2ECC71", "border": "#5D6D7E"},
    "🏜️ Desert": {"primary": "#D4A373", "secondary": "#FAEDCD", "accent": "#E9EDC9", "bg": "#2D2B1B", "card": "#3D3B2B", "text": "#FFF5E0", "text_secondary": "#FAEDCD", "button_hover": "#E9EDC9", "border": "#D4A373"},
    "❄️ Ice": {"primary": "#E0F7FA", "secondary": "#B2EBF2", "accent": "#00BCD4", "bg": "#ECEFF1", "card": "#FFFFFF", "text": "#006064", "text_secondary": "#00838F", "button_hover": "#00BCD4", "border": "#E0F7FA"},
}

# دسته نهم: طلایی
gold_themes = {
    "💛 Sunshine": {"primary": "#FDCB6E", "secondary": "#FFEAA7", "accent": "#E17055", "bg": "#2D2B1B", "card": "#3D3B2B", "text": "#FFF5E0", "text_secondary": "#FFEAA7", "button_hover": "#E17055", "border": "#FDCB6E"},
    "⭐ Golden": {"primary": "#F1C40F", "secondary": "#F9E79F", "accent": "#D4AC0D", "bg": "#2D2A15", "card": "#3D3A25", "text": "#FEF9E7", "text_secondary": "#F9E79F", "button_hover": "#D4AC0D", "border": "#F1C40F"},
    "💛 Honey": {"primary": "#F39C12", "secondary": "#F5B041", "accent": "#E67E22", "bg": "#2D1B15", "card": "#3D2B25", "text": "#FFF5E0", "text_secondary": "#F5B041", "button_hover": "#E67E22", "border": "#F39C12"},
    "🌻 Sunflower": {"primary": "#FFD700", "secondary": "#FFEA00", "accent": "#FF8F00", "bg": "#2D2B1B", "card": "#3D3B2B", "text": "#FFFFE0", "text_secondary": "#FFEA00", "button_hover": "#FF8F00", "border": "#FFD700"},
    "🧀 Cheese": {"primary": "#F1C40F", "secondary": "#F7DC6F", "accent": "#E67E22", "bg": "#2D2A15", "card": "#3D3A25", "text": "#FEF9E7", "text_secondary": "#F7DC6F", "button_hover": "#E67E22", "border": "#F1C40F"},
}

# دسته دهم: تم‌های ویژه
special_themes = {
    "🎄 Christmas": {"primary": "#E74C3C", "secondary": "#27AE60", "accent": "#F1C40F", "bg": "#1A2A1A", "card": "#2A3A2A", "text": "#FFFFFF", "text_secondary": "#E74C3C", "button_hover": "#F1C40F", "border": "#27AE60"},
    "🎃 Halloween": {"primary": "#E67E22", "secondary": "#8E44AD", "accent": "#2C3E50", "bg": "#1A1A1A", "card": "#2C2C2C", "text": "#FF8C00", "text_secondary": "#8E44AD", "button_hover": "#E67E22", "border": "#FF4500"},
    "💝 Valentine": {"primary": "#FF6B8B", "secondary": "#FF9EC4", "accent": "#C0392B", "bg": "#2D1B2E", "card": "#3D2B3E", "text": "#FFF0F5", "text_secondary": "#FF9EC4", "button_hover": "#C0392B", "border": "#FF6B8B"},
    "🍀 StPatrick": {"primary": "#2ECC71", "secondary": "#27AE60", "accent": "#F1C40F", "bg": "#1A2A1A", "card": "#2A3A2A", "text": "#F0FFF0", "text_secondary": "#F1C40F", "button_hover": "#F1C40F", "border": "#2ECC71"},
    "🇯🇵 Japan": {"primary": "#BC002D", "secondary": "#FFFFFF", "accent": "#000000", "bg": "#1A1A1A", "card": "#2C2C2C", "text": "#FFFFFF", "text_secondary": "#BC002D", "button_hover": "#BC002D", "border": "#FFFFFF"},
    "🇰🇷 Korea": {"primary": "#00462A", "secondary": "#FFFFFF", "accent": "#CD2E3A", "bg": "#1A2A1A", "card": "#2A3A2A", "text": "#FFFFFF", "text_secondary": "#CD2E3A", "button_hover": "#00462A", "border": "#CD2E3A"},
}

# ادغام همه تم‌ها
for collection in [rainbow_themes, pink_themes, purple_themes, blue_themes, green_themes, red_orange_themes, anime_themes, classic_themes, gold_themes, special_themes]:
    THEMES.update(collection)

THEME_NAMES = list(THEMES.keys())

# تمام ژانرهای انیمه
ANIME_GENRES = [
    "🎬 Action", "🗺️ Adventure", "😂 Comedy", "🎭 Drama", "💕 Ecchi", "✨ Fantasy",
    "💑 Harem", "🏯 Historical", "👻 Horror", "🌍 Isekai", "👩 Josei", "🧸 Kids",
    "🔮 Magic", "🥋 Martial Arts", "🤖 Mecha", "⚔️ Military", "🎵 Music",
    "🔍 Mystery", "🧠 Psychological", "💖 Romance", "⚔️ Samurai", "📚 School",
    "🚀 Sci-Fi", "👨 Seinen", "👧 Shoujo", "💗 Shoujo Ai", "👦 Shounen",
    "💙 Shounen Ai", "🌸 Slice of Life", "🌌 Space", "🏀 Sports", "💪 Super Power",
    "👻 Supernatural", "🔪 Thriller", "🧛 Vampire", "💜 Yaoi", "💚 Yuri",
    "🎯 Mecha", "🤖 Cyberpunk", "🏰 Medieval", "🐉 Demons", "👽 Aliens",
    "🧙 Magic", "🏛️ Mythology", "🎨 Art", "🍔 Cooking", "🏥 Medical"
]

# ==================== زبان‌ها ====================
TEXTS = {
    "en": {
        "title": "🎌 AniDiary", "subtitle": "Your Premium Anime Journal",
        "add_anime": "➕ Add New Anime", "add_sub": "Add your anime memories",
        "anime_name": "🎯 Anime Name", "anime_name_ph": "Enter anime name...",
        "genre": "🏷️ Genre", "status": "📊 Status", "rating": "⭐ Rating (0-10)",
        "notes": "📝 Personal Notes", "add_btn": "✨ Add to Diary", "clear_btn": "🗑️ Clear Form",
        "search": "🔍 Search anime...", "delete_all": "🗑️ Delete All",
        "filter_by": "Filter by:", "all": "All", "watching": "🎬 Watching",
        "completed": "✅ Completed", "planned": "📝 Planned",
        "genre_filter": "Genre filter:", "all_genres": "All Genres",
        "theme": "🎨 Theme:", "language": "🌐 Language",
        "confirm_delete": "Delete '{}'?", "confirm_delete_all": "Delete ALL anime?",
        "success_add": "✨ '{}' added!", "success_delete": "🗑️ '{}' removed!",
        "success_delete_all": "🗑️ All deleted!", "warning": "Warning",
        "warning_empty_name": "🌸 Enter anime name!", "warning_select_genre": "🎭 Select genre!",
        "success": "Success", "no_anime": "🎌 Your diary is empty!\nAdd your first anime",
        "watching_badge": "WATCHING", "completed_badge": "COMPLETED", "planned_badge": "PLANNED",
        "edit_notes": "✏️ Edit Notes", "edit_notes_title": "Edit Notes",
        "edit_notes_text": "Edit your notes:", "delete": "🗑️ Delete",
        "watching_btn": "🎬 Watching", "completed_btn": "✅ Completed", "plan_btn": "📝 Plan",
        "no_notes": "No notes", "stats": "📊", "added": "Added", "modified": "Modified",
        "export": "💾 Export", "import": "📂 Import", "sort": "📊 Sort by",
        "sort_name": "Name", "sort_date": "Date", "sort_rating": "Rating",
        "settings": "⚙️ Settings", "about": "ℹ️ About", "refresh": "🔄 Refresh"
    },
    "fa": {
        "title": "🎌 AniDiary", "subtitle": "دفترچه خاطرات انیمه شما",
        "add_anime": "➕ افزودن انیمه جدید", "add_sub": "خاطرات انیمه خود را اضافه کنید",
        "anime_name": "🎯 نام انیمه", "anime_name_ph": "مثلاً: Attack on Titan",
        "genre": "🏷️ ژانر", "status": "📊 وضعیت", "rating": "⭐ امتیاز (۰-۱۰)",
        "notes": "📝 یادداشت شخصی", "add_btn": "✨ افزودن به دفترچه", "clear_btn": "🗑️ پاک کردن فرم",
        "search": "🔍 جستجوی انیمه...", "delete_all": "🗑️ حذف همه",
        "filter_by": "فیلتر بر اساس:", "all": "همه", "watching": "🎬 در حال تماشا",
        "completed": "✅ تموم شده", "planned": "📝 برنامه دارم",
        "genre_filter": "فیلتر ژانر:", "all_genres": "همه ژانرها",
        "theme": "🎨 تم:", "language": "🌐 زبان",
        "confirm_delete": "آیا '{}' رو حذف کنی؟", "confirm_delete_all": "حذف همه انیمه‌ها؟",
        "success_add": "✨ '{}' اضافه شد!", "success_delete": "🗑️ '{}' حذف شد!",
        "success_delete_all": "🗑️ همه حذف شدن!", "warning": "اخطار",
        "warning_empty_name": "🌸 نام انیمه را وارد کن!", "warning_select_genre": "🎭 ژانر را انتخاب کن!",
        "success": "موفقیت", "no_anime": "🎌 دفترچه خالی است!\nاولین انیمه را اضافه کن",
        "watching_badge": "در حال تماشا", "completed_badge": "تموم شده", "planned_badge": "برنامه دارم",
        "edit_notes": "✏️ ویرایش یادداشت", "edit_notes_title": "ویرایش یادداشت",
        "edit_notes_text": "یادداشت خود را ویرایش کن:", "delete": "🗑️ حذف",
        "watching_btn": "🎬 در حال تماشا", "completed_btn": "✅ تموم شد", "plan_btn": "📝 بعداً ببینم",
        "no_notes": "بدون یادداشت", "stats": "📊", "added": "افزوده شده", "modified": "ویرایش شده",
        "export": "💾 خروجی", "import": "📂 ورودی", "sort": "📊 مرتب سازی",
        "sort_name": "نام", "sort_date": "تاریخ", "sort_rating": "امتیاز",
        "settings": "⚙️ تنظیمات", "about": "ℹ️ درباره", "refresh": "🔄 تازه سازی"
    }
}

# ==================== کلاس دکمه انیمیشنی ====================
class AnimatedButton(ctk.CTkButton):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.original_color = self.cget("fg_color")
        self.original_height = self.cget("height")
        
        self.bind("<Enter>", self.on_enter)
        self.bind("<Leave>", self.on_leave)
        self.bind("<ButtonPress-1>", self.on_press)
        self.bind("<ButtonRelease-1>", self.on_release)
        
    def on_enter(self, event):
        self.configure(fg_color=self.cget("hover_color"))
        self.configure(height=int(self.original_height * 1.02))
        
    def on_leave(self, event):
        self.configure(fg_color=self.original_color)
        self.configure(height=self.original_height)
        
    def on_press(self, event):
        self.configure(height=int(self.original_height * 0.96))
        
    def on_release(self, event):
        self.configure(height=self.original_height)
        self.flash()
        
    def flash(self):
        original = self.cget("fg_color")
        self.configure(fg_color="#FFFFFF")
        self.after(80, lambda: self.configure(fg_color=self.cget("hover_color")))
        self.after(160, lambda: self.configure(fg_color=original))

# ==================== کلاس اصلی برنامه ====================
class AniDiary:
    def __init__(self):
        # فایل داده
        self.data_file = "anidiary_data.json"
        self.load_data()
        
        # تنظیمات
        self.current_lang = "fa"
        self.current_theme = "🌈 Rainbow Dream"
        self.current_status_filter = "all"
        self.current_genre_filter = "all"
        self.sort_by = "date"
        
        # پنجره اصلی
        self.window = ctk.CTk()
        self.window.title("AniDiary - Anime Journal")
        self.window.geometry("1700x950")
        
        # ========== تنظیم آیکون با ۶ روش (تضمینی) ==========
        self.set_window_icon_guaranteed()
        
        # مرکز کردن پنجره
        self.window.update_idletasks()
        x = (self.window.winfo_screenwidth() - 1700) // 2
        y = (self.window.winfo_screenheight() - 950) // 2
        self.window.geometry(f"1700x950+{x}+{y}")
        
        # راه‌اندازی UI
        self.setup_ui()
        self.apply_theme()
        self.update_all_texts()
        self.update_anime_list()
        
    def set_window_icon_guaranteed(self):
        """تنظیم آیکون با ۶ روش مختلف - تضمینی"""
        # روش اول: بررسی فایل ico در مسیرهای مختلف
        icon_paths = ["anidiary.ico", "icon.ico", "assets/anidiary.ico", "assets/icon.ico", r"D:\puolstar\codes\Tests\anidiary.ico"]
        icon_found = None
        for path in icon_paths:
            if os.path.exists(path):
                icon_found = path
                break
        
        if icon_found:
            try:
                self.window.iconbitmap(icon_found)
                print(f"✅ آیکون از فایل {icon_found} بارگذاری شد")
                return
            except:
                pass
        
        # روش دوم: استفاده از wm_iconbitmap
        try:
            self.window.wm_iconbitmap("anidiary.ico")
            print("✅ آیکون با wm_iconbitmap تنظیم شد")
            return
        except:
            pass
        
        # روش سوم: ایجاد آیکون از فایل با PhotoImage
        if icon_found:
            try:
                img = Image.open(icon_found)
                temp_file = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
                img.save(temp_file.name, format="PNG")
                icon_photo = tk.PhotoImage(file=temp_file.name)
                self.window.iconphoto(True, icon_photo)
                self._icon_photo = icon_photo
                os.unlink(temp_file.name)
                print("✅ آیکون با PhotoImage تنظیم شد")
                return
            except:
                pass
        
        # روش چهارم: استفاده از PIL برای تبدیل
        try:
            if icon_found:
                img = Image.open(icon_found)
                img = img.resize((32, 32))
                # تبدیل به داده base64 و استفاده
                import base64
                from io import BytesIO
                buffer = BytesIO()
                img.save(buffer, format='PNG')
                data = base64.b64encode(buffer.getvalue()).decode()
                photo = tk.PhotoImage(data=data)
                self.window.iconphoto(True, photo)
                self._icon_photo = photo
                print("✅ آیکون با base64 تنظیم شد")
                return
        except:
            pass
        
        # روش پنجم: آیکون پیشفرض رنگی (قرمز نباشد! از رنگ تم استفاده کن)
        try:
            img = Image.new('RGBA', (32, 32), color='#6C5CE7')
            temp_file = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
            img.save(temp_file.name, format="PNG")
            icon_photo = tk.PhotoImage(file=temp_file.name)
            self.window.iconphoto(True, icon_photo)
            self._icon_photo = icon_photo
            os.unlink(temp_file.name)
            print("✅ آیکون پیشفرض (بنفش) تنظیم شد")
            return
        except:
            pass
        
        # روش ششم: فقط عنوان را با ایموجی تنظیم کن
        self.window.title("🎌 AniDiary")
        print("✅ آیکون با ایموجی در عنوان تنظیم شد")
        
    def t(self, key):
        return TEXTS[self.current_lang].get(key, key)
        
    def load_data(self):
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, "r", encoding="utf-8") as f:
                    self.anime_list = json.load(f)
            except:
                self.anime_list = []
        else:
            self.anime_list = []
            
    def save_data(self):
        with open(self.data_file, "w", encoding="utf-8") as f:
            json.dump(self.anime_list, f, ensure_ascii=False, indent=2)
    
    def setup_ui(self):
        """راه‌اندازی رابط کاربری با اسکرول برای تم‌ها و آپشن‌های بیشتر"""
        
        # نوار ابزار بالا
        self.toolbar = ctk.CTkFrame(self.window, height=75, corner_radius=0)
        self.toolbar.pack(fill="x", padx=0, pady=0)
        
        # لوگو
        logo_frame = ctk.CTkFrame(self.toolbar, fg_color="transparent")
        logo_frame.pack(side="left", padx=25)
        
        self.title_label = ctk.CTkLabel(logo_frame, text="", font=("Comic Sans MS", 32, "bold"))
        self.title_label.pack(side="left")
        
        self.subtitle_label = ctk.CTkLabel(logo_frame, text="", font=("Segoe UI", 11, "italic"))
        self.subtitle_label.pack(side="left", padx=(12, 0))
        
        # تنظیمات سمت راست - با اسکرول برای تم‌ها
        settings_frame = ctk.CTkFrame(self.toolbar, fg_color="transparent")
        settings_frame.pack(side="right", padx=25)
        
        # دکمه زبان
        self.lang_btn = AnimatedButton(settings_frame, text="", command=self.toggle_language, width=120, height=38, font=("Comic Sans MS", 12, "bold"), corner_radius=12)
        self.lang_btn.pack(side="left", padx=6)
        
        # انتخاب تم با اسکرول! (به جای OptionMenu از یک فریم اسکرول‌دار استفاده می‌کنیم)
        self.theme_label = ctk.CTkLabel(settings_frame, text="", font=("Segoe UI", 12))
        self.theme_label.pack(side="left", padx=8)
        
        # ایجاد یک فریم برای منوی تم با اسکرول
        self.theme_button = AnimatedButton(settings_frame, text="🌈 Rainbow Dream", command=self.show_theme_menu, width=210, height=38, font=("Segoe UI", 11), corner_radius=10)
        self.theme_button.pack(side="left", padx=6)
        
        # منوی تم (در ابتدا مخفی) - یک پنجره popup با اسکرول
        self.theme_menu_window = None
        
        # مرتب‌سازی
        self.sort_label = ctk.CTkLabel(settings_frame, text="", font=("Segoe UI", 12))
        self.sort_label.pack(side="left", padx=8)
        
        self.sort_var = ctk.StringVar(value="date")
        sort_options = ["date", "name", "rating"]
        sort_display = {self.t("sort_date"): "date", self.t("sort_name"): "name", self.t("sort_rating"): "rating"}
        self.sort_menu = ctk.CTkOptionMenu(settings_frame, values=list(sort_display.keys()), command=self.change_sort, width=100, height=38, font=("Segoe UI", 11))
        self.sort_menu.pack(side="left", padx=6)
        
        # آمار
        self.stats_label = ctk.CTkLabel(settings_frame, text="", font=("Courier New", 12))
        self.stats_label.pack(side="left", padx=(18, 0))
        
        # دکمه تازه‌سازی
        self.refresh_btn = AnimatedButton(settings_frame, text="", command=self.refresh_list, width=60, height=38, font=("Segoe UI", 12), corner_radius=10, fg_color="#3498DB", hover_color="#2980B9")
        self.refresh_btn.pack(side="left", padx=6)
        
        # کانتینر اصلی
        main_container = ctk.CTkFrame(self.window, fg_color="transparent")
        main_container.pack(fill="both", expand=True, padx=22, pady=18)
        
        # ========== پنل چپ ==========
        self.left_panel = ctk.CTkFrame(main_container, width=470, corner_radius=25)
        self.left_panel.pack(side="left", fill="y", padx=(0, 22))
        self.left_panel.pack_propagate(False)
        
        # هدر پنل
        panel_header = ctk.CTkFrame(self.left_panel, fg_color="transparent", height=65)
        panel_header.pack(fill="x", padx=28, pady=(22, 12))
        
        self.add_title = ctk.CTkLabel(panel_header, text="", font=("Segoe UI", 24, "bold"))
        self.add_title.pack(anchor="w")
        
        self.add_subtitle = ctk.CTkLabel(panel_header, text="", font=("Segoe UI", 11), text_color="gray65")
        self.add_subtitle.pack(anchor="w")
        
        # فرم
        form_scroll = ctk.CTkScrollableFrame(self.left_panel, fg_color="transparent")
        form_scroll.pack(fill="both", expand=True, padx=28, pady=12)
        
        # نام
        self.name_label = ctk.CTkLabel(form_scroll, text="", font=("Segoe UI", 14, "bold"), anchor="w")
        self.name_label.pack(fill="x", pady=(12, 6))
        self.name_entry = ctk.CTkEntry(form_scroll, placeholder_text="", height=48, font=("Segoe UI", 14))
        self.name_entry.pack(fill="x", pady=(0, 18))
        
        # ژانر
        self.genre_label = ctk.CTkLabel(form_scroll, text="", font=("Segoe UI", 14, "bold"), anchor="w")
        self.genre_label.pack(fill="x", pady=(0, 6))
        self.genre_var = ctk.StringVar(value="Select Genre")
        self.genre_menu = ctk.CTkOptionMenu(form_scroll, values=ANIME_GENRES, variable=self.genre_var, height=48, font=("Segoe UI", 13))
        self.genre_menu.pack(fill="x", pady=(0, 18))
        
        # وضعیت
        self.status_label = ctk.CTkLabel(form_scroll, text="", font=("Segoe UI", 14, "bold"), anchor="w")
        self.status_label.pack(fill="x", pady=(0, 6))
        self.status_var = ctk.StringVar(value="watching")
        
        status_frame = ctk.CTkFrame(form_scroll, fg_color="transparent")
        status_frame.pack(fill="x", pady=(0, 18))
        
        self.watching_radio = ctk.CTkRadioButton(status_frame, text="", variable=self.status_var, value="watching", font=("Segoe UI", 12))
        self.watching_radio.pack(side="left", padx=8)
        self.completed_radio = ctk.CTkRadioButton(status_frame, text="", variable=self.status_var, value="completed", font=("Segoe UI", 12))
        self.completed_radio.pack(side="left", padx=8)
        self.planned_radio = ctk.CTkRadioButton(status_frame, text="", variable=self.status_var, value="planned", font=("Segoe UI", 12))
        self.planned_radio.pack(side="left", padx=8)
        
        # امتیاز
        self.rating_label = ctk.CTkLabel(form_scroll, text="", font=("Segoe UI", 14, "bold"), anchor="w")
        self.rating_label.pack(fill="x", pady=(0, 6))
        
        rating_frame = ctk.CTkFrame(form_scroll, fg_color="transparent")
        rating_frame.pack(fill="x", pady=(0, 18))
        
        self.rating_slider = ctk.CTkSlider(rating_frame, from_=0, to=10, number_of_steps=20, height=10)
        self.rating_slider.pack(side="left", fill="x", expand=True, padx=(0, 15))
        
        self.rating_value = ctk.CTkLabel(rating_frame, text="⭐ 0.0", font=("Segoe UI", 15, "bold"), text_color="#FFD700")
        self.rating_value.pack(side="right")
        self.rating_slider.configure(command=self.update_rating_label)
        
        # یادداشت
        self.notes_label = ctk.CTkLabel(form_scroll, text="", font=("Segoe UI", 14, "bold"), anchor="w")
        self.notes_label.pack(fill="x", pady=(0, 6))
        self.notes_text = ctk.CTkTextbox(form_scroll, height=130, font=("Segoe UI", 12))
        self.notes_text.pack(fill="x", pady=(0, 18))
        
        # دکمه‌ها
        btn_frame = ctk.CTkFrame(form_scroll, fg_color="transparent")
        btn_frame.pack(fill="x", pady=(12, 25))
        
        self.add_btn = AnimatedButton(btn_frame, text="", command=self.add_anime, height=52, font=("Comic Sans MS", 15, "bold"), corner_radius=14)
        self.add_btn.pack(side="left", fill="x", expand=True, padx=(0, 8))
        
        self.clear_btn = AnimatedButton(btn_frame, text="", command=self.clear_form, height=52, font=("Comic Sans MS", 15), corner_radius=14, fg_color="gray32", hover_color="gray42")
        self.clear_btn.pack(side="right", fill="x", expand=True, padx=(8, 0))
        
        # ========== پنل راست ==========
        self.right_panel = ctk.CTkFrame(main_container, corner_radius=25)
        self.right_panel.pack(side="right", fill="both", expand=True)
        
        # فیلترها
        filter_section = ctk.CTkFrame(self.right_panel, fg_color="transparent")
        filter_section.pack(fill="x", padx=28, pady=18)
        
        # جستجو
        search_frame = ctk.CTkFrame(filter_section, fg_color="transparent")
        search_frame.pack(fill="x", pady=(0, 15))
        
        self.search_entry = ctk.CTkEntry(search_frame, placeholder_text="", height=48, font=("Segoe UI", 13))
        self.search_entry.pack(side="left", fill="x", expand=True, padx=(0, 18))
        self.search_entry.bind('<KeyRelease>', self.search_anime)
        
        self.delete_all_btn = AnimatedButton(search_frame, text="", command=self.delete_all_anime, width=130, height=48, fg_color="#E74C3C", hover_color="#C0392B", font=("Comic Sans MS", 13, "bold"), corner_radius=12)
        self.delete_all_btn.pack(side="right")
        
        # فیلتر وضعیت
        filter_row = ctk.CTkFrame(filter_section, fg_color="transparent")
        filter_row.pack(fill="x", pady=8)
        
        self.filter_label = ctk.CTkLabel(filter_row, text="", font=("Segoe UI", 13, "bold"))
        self.filter_label.pack(side="left", padx=(0, 18))
        
        self.filter_buttons = []
        status_filters = ["all", "watching", "completed", "planned"]
        
        for f_type in status_filters:
            btn = AnimatedButton(filter_row, text="", command=lambda f=f_type: self.filter_by_status(f), width=115, height=38, font=("Segoe UI", 12), corner_radius=10)
            btn.pack(side="left", padx=4)
            self.filter_buttons.append((btn, f_type))
        
        # فیلتر ژانر
        genre_frame = ctk.CTkFrame(filter_section, fg_color="transparent")
        genre_frame.pack(fill="x", pady=(14, 0))
        
        self.genre_filter_label = ctk.CTkLabel(genre_frame, text="", font=("Segoe UI", 13, "bold"))
        self.genre_filter_label.pack(side="left", padx=(0, 18))
        
        self.genre_filter_var = ctk.StringVar(value="")
        self.genre_filter_menu = ctk.CTkOptionMenu(genre_frame, values=[], variable=self.genre_filter_var, command=self.filter_by_genre, width=240, height=38, font=("Segoe UI", 12))
        self.genre_filter_menu.pack(side="left")
        
        # دکمه‌های اضافی
        extra_frame = ctk.CTkFrame(filter_section, fg_color="transparent")
        extra_frame.pack(fill="x", pady=(14, 0))
        
        self.export_btn = AnimatedButton(extra_frame, text="", command=self.export_data, width=110, height=35, font=("Segoe UI", 11), corner_radius=10, fg_color="#27AE60", hover_color="#2ECC71")
        self.export_btn.pack(side="left", padx=4)
        
        self.import_btn = AnimatedButton(extra_frame, text="", command=self.import_data, width=110, height=35, font=("Segoe UI", 11), corner_radius=10, fg_color="#2980B9", hover_color="#3498DB")
        self.import_btn.pack(side="left", padx=4)
        
        # دکمه درباره
        self.about_btn = AnimatedButton(extra_frame, text="", command=self.show_about, width=100, height=35, font=("Segoe UI", 11), corner_radius=10, fg_color="#8E44AD", hover_color="#9B59B6")
        self.about_btn.pack(side="left", padx=4)
        
        # لیست انیمه‌ها
        self.anime_list_frame = ctk.CTkScrollableFrame(self.right_panel, height=560)
        self.anime_list_frame.pack(fill="both", expand=True, padx=28, pady=(12, 22))
        
    def show_theme_menu(self):
        """نمایش منوی تم با اسکرول"""
        if self.theme_menu_window is not None:
            self.theme_menu_window.destroy()
            
        self.theme_menu_window = ctk.CTkToplevel(self.window)
        self.theme_menu_window.title("Select Theme")
        self.theme_menu_window.geometry("300x400")
        self.theme_menu_window.transient(self.window)
        self.theme_menu_window.grab_set()
        
        # فریم اسکرول‌دار برای تم‌ها
        scroll_frame = ctk.CTkScrollableFrame(self.theme_menu_window, width=280, height=380)
        scroll_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        for theme_name in THEME_NAMES:
            btn = ctk.CTkButton(scroll_frame, text=theme_name, command=lambda t=theme_name: self.select_theme(t), height=40, corner_radius=8)
            btn.pack(fill="x", padx=5, pady=3)
            
    def select_theme(self, theme_name):
        """انتخاب تم از منو"""
        self.current_theme = theme_name
        self.theme_button.configure(text=theme_name)
        self.apply_theme()
        if self.theme_menu_window:
            self.theme_menu_window.destroy()
            self.theme_menu_window = None
            
    def refresh_list(self):
        """تازه‌سازی لیست"""
        self.update_anime_list(self.search_entry.get())
        
    def show_about(self):
        """نمایش اطلاعات درباره برنامه"""
        about_text = f"""🎌 AniDiary
Version 3.0

Your Premium Anime Journal


100+ Themes
50+ Genres
Persian & English Support

© 2026 AdLand"""
        messagebox.showinfo(self.t("about"), about_text)
        
    def update_all_texts(self):
        """بروزرسانی همه متون"""
        self.title_label.configure(text=self.t("title"))
        self.subtitle_label.configure(text=self.t("subtitle"))
        self.lang_btn.configure(text="🇮🇷 فارسی" if self.current_lang == "fa" else "🇬🇧 English")
        self.theme_label.configure(text=self.t("theme"))
        self.sort_label.configure(text=self.t("sort"))
        
        sort_texts = {self.t("sort_date"): "date", self.t("sort_name"): "name", self.t("sort_rating"): "rating"}
        self.sort_menu.configure(values=list(sort_texts.keys()))
        
        self.refresh_btn.configure(text=self.t("refresh"))
        self.about_btn.configure(text=self.t("about"))
        
        self.add_title.configure(text=self.t("add_anime"))
        self.add_subtitle.configure(text=self.t("add_sub"))
        self.name_label.configure(text=self.t("anime_name"))
        self.name_entry.configure(placeholder_text=self.t("anime_name_ph"))
        self.genre_label.configure(text=self.t("genre"))
        self.status_label.configure(text=self.t("status"))
        self.rating_label.configure(text=self.t("rating"))
        self.notes_label.configure(text=self.t("notes"))
        self.add_btn.configure(text=self.t("add_btn"))
        self.clear_btn.configure(text=self.t("clear_btn"))
        
        self.watching_radio.configure(text=self.t("watching"))
        self.completed_radio.configure(text=self.t("completed"))
        self.planned_radio.configure(text=self.t("planned"))
        
        self.search_entry.configure(placeholder_text=self.t("search"))
        self.delete_all_btn.configure(text=self.t("delete_all"))
        self.filter_label.configure(text=self.t("filter_by"))
        self.genre_filter_label.configure(text=self.t("genre_filter"))
        
        self.export_btn.configure(text=self.t("export"))
        self.import_btn.configure(text=self.t("import"))
        
        filter_texts = {"all": self.t("all"), "watching": self.t("watching"), "completed": self.t("completed"), "planned": self.t("planned")}
        for btn, f_type in self.filter_buttons:
            btn.configure(text=filter_texts.get(f_type, f_type))
        
        genre_values = [self.t("all_genres")] + ANIME_GENRES
        self.genre_filter_menu.configure(values=genre_values)
        if self.current_genre_filter == "all":
            self.genre_filter_var.set(self.t("all_genres"))
        else:
            self.genre_filter_var.set(self.current_genre_filter)
    
    def change_sort(self, value):
        sort_map = {self.t("sort_date"): "date", self.t("sort_name"): "name", self.t("sort_rating"): "rating"}
        self.sort_by = sort_map.get(value, "date")
        self.update_anime_list(self.search_entry.get())
            
    def update_rating_label(self, value):
        rating = float(value)
        stars = "⭐" * int(rating // 2) + "☆" * (5 - int(rating // 2))
        self.rating_value.configure(text=f"{stars} {rating:.1f}")
        
    def apply_theme(self):
        theme = THEMES[self.current_theme]
        self.window.configure(fg_color=theme["bg"])
        self.toolbar.configure(fg_color=theme["primary"])
        self.left_panel.configure(fg_color=theme["card"], border_color=theme["border"], border_width=2)
        self.right_panel.configure(fg_color=theme["card"], border_color=theme["border"], border_width=2)
        self.title_label.configure(text_color=theme["text"])
        self.add_btn.configure(fg_color=theme["primary"], hover_color=theme["button_hover"])
        self.rating_slider.configure(progress_color=theme["accent"], button_color=theme["accent"])
        
        for btn, f_type in self.filter_buttons:
            if f_type == self.current_status_filter:
                btn.configure(fg_color=theme["accent"])
            else:
                btn.configure(fg_color="gray30")
        
        self.update_anime_list()
        
    def change_theme(self, theme_name):
        self.current_theme = theme_name
        self.theme_button.configure(text=theme_name)
        self.apply_theme()
        
    def toggle_language(self):
        self.current_lang = "en" if self.current_lang == "fa" else "fa"
        self.update_all_texts()
        self.update_anime_list()
        
    def export_data(self):
        file_path = f"anidiary_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(self.anime_list, f, ensure_ascii=False, indent=2)
            messagebox.showinfo(self.t("success"), f"✅ Exported to {file_path}")
        except Exception as e:
            messagebox.showerror(self.t("warning"), f"Export failed: {e}")
            
    def import_data(self):
        from tkinter import filedialog
        file_path = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
        if file_path:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    self.anime_list = json.load(f)
                self.save_data()
                self.update_anime_list()
                messagebox.showinfo(self.t("success"), "✅ Data imported successfully!")
            except Exception as e:
                messagebox.showerror(self.t("warning"), f"Import failed: {e}")
        
    def add_anime(self):
        name = self.name_entry.get().strip()
        genre = self.genre_var.get()
        status = self.status_var.get()
        rating = self.rating_slider.get()
        notes = self.notes_text.get("1.0", "end-1c").strip()
        
        if not name:
            messagebox.showwarning(self.t("warning"), self.t("warning_empty_name"))
            return
        if genre == "Select Genre":
            messagebox.showwarning(self.t("warning"), self.t("warning_select_genre"))
            return
        
        anime_data = {
            "id": len(self.anime_list) + 1 if self.anime_list else 1,
            "name": name, "genre": genre, "status": status,
            "rating": float(rating), "notes": notes if notes else self.t("no_notes"),
            "date_added": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "date_modified": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        self.anime_list.append(anime_data)
        self.save_data()
        
        self.add_btn.configure(fg_color="#2ECC71")
        self.window.after(200, lambda: self.add_btn.configure(fg_color=THEMES[self.current_theme]["primary"]))
        
        messagebox.showinfo(self.t("success"), self.t("success_add").format(name))
        self.clear_form()
        self.update_anime_list()
        
    def delete_anime(self, anime_id, anime_name):
        if messagebox.askyesno(self.t("warning"), self.t("confirm_delete").format(anime_name)):
            self.anime_list = [a for a in self.anime_list if a["id"] != anime_id]
            for i, anime in enumerate(self.anime_list, 1):
                anime["id"] = i
            self.save_data()
            self.update_anime_list()
            
    def delete_all_anime(self):
        if messagebox.askyesno(self.t("warning"), self.t("confirm_delete_all")):
            self.anime_list = []
            self.save_data()
            self.update_anime_list()
            messagebox.showinfo(self.t("success"), self.t("success_delete_all"))
            
    def update_status(self, anime_id, new_status):
        for anime in self.anime_list:
            if anime["id"] == anime_id:
                anime["status"] = new_status
                anime["date_modified"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                break
        self.save_data()
        self.update_anime_list()
        
    def edit_notes(self, anime_id, current_notes):
        if current_notes == self.t("no_notes"):
            current_notes = ""
        dialog = ctk.CTkInputDialog(text=self.t("edit_notes_text"), title=self.t("edit_notes_title"), default_text=current_notes)
        new_notes = dialog.get_input()
        if new_notes is not None:
            for anime in self.anime_list:
                if anime["id"] == anime_id:
                    anime["notes"] = new_notes if new_notes.strip() else self.t("no_notes")
                    anime["date_modified"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    break
            self.save_data()
            self.update_anime_list()
            
    def filter_by_status(self, filter_type):
        self.current_status_filter = filter_type
        theme = THEMES[self.current_theme]
        for btn, f_type in self.filter_buttons:
            if f_type == filter_type:
                btn.configure(fg_color=theme["accent"])
            else:
                btn.configure(fg_color="gray30")
        self.update_anime_list(self.search_entry.get())
        
    def filter_by_genre(self, genre):
        if genre == self.t("all_genres"):
            self.current_genre_filter = "all"
        else:
            self.current_genre_filter = genre
        self.update_anime_list(self.search_entry.get())
        
    def search_anime(self, event=None):
        self.update_anime_list(self.search_entry.get())
        
    def update_anime_list(self, search_text=""):
        for widget in self.anime_list_frame.winfo_children():
            widget.destroy()
            
        filtered = self.anime_list.copy()
        
        if self.current_status_filter != "all":
            filtered = [a for a in filtered if a["status"] == self.current_status_filter]
        
        if self.current_genre_filter != "all":
            filtered = [a for a in filtered if a["genre"] == self.current_genre_filter]
        
        if search_text:
            filtered = [a for a in filtered if search_text.lower() in a["name"].lower()]
        
        # مرتب‌سازی
        if self.sort_by == "name":
            filtered.sort(key=lambda x: x["name"].lower())
        elif self.sort_by == "rating":
            filtered.sort(key=lambda x: x["rating"], reverse=True)
        else:
            filtered.sort(key=lambda x: x.get("date_added", ""), reverse=True)
        
        total = len(self.anime_list)
        self.stats_label.configure(text=f"{self.t('stats')} {len(filtered)}/{total}")
        
        if not filtered:
            empty_frame = ctk.CTkFrame(self.anime_list_frame, fg_color="transparent")
            empty_frame.pack(expand=True, fill="both", pady=100)
            ctk.CTkLabel(empty_frame, text="🎌✨", font=("Segoe UI", 70)).pack()
            ctk.CTkLabel(empty_frame, text=self.t("no_anime"), font=("Segoe UI", 20, "bold"), text_color="gray60").pack(pady=20)
            return
        
        theme = THEMES[self.current_theme]
        status_colors = {"watching": "#3498DB", "completed": "#2ECC71", "planned": "#F39C12"}
        status_texts = {"watching": self.t("watching_badge"), "completed": self.t("completed_badge"), "planned": self.t("planned_badge")}
        
        for anime in filtered:
            card = ctk.CTkFrame(self.anime_list_frame, corner_radius=16, border_width=2, border_color=status_colors.get(anime["status"], theme["secondary"]), fg_color=theme["card"])
            card.pack(fill="x", padx=12, pady=8)
            
            inner = ctk.CTkFrame(card, fg_color="transparent")
            inner.pack(fill="x", padx=22, pady=16)
            
            header = ctk.CTkFrame(inner, fg_color="transparent")
            header.pack(fill="x")
            
            name_label = ctk.CTkLabel(header, text=f"🎴 {anime['name']}", font=("Segoe UI", 17, "bold"), text_color=theme["text"])
            name_label.pack(side="left")
            
            status_badge = ctk.CTkLabel(header, text=status_texts.get(anime["status"], anime["status"]), font=("Consolas", 10, "bold"), text_color="white", fg_color=status_colors.get(anime["status"], theme["secondary"]), corner_radius=10, padx=14, pady=5)
            status_badge.pack(side="left", padx=(14, 0))
            
            info_row = ctk.CTkFrame(inner, fg_color="transparent")
            info_row.pack(fill="x", pady=10)
            
            genre_label = ctk.CTkLabel(info_row, text=f"🏷️ {anime['genre']}", font=("Segoe UI", 12), text_color=theme["text_secondary"])
            genre_label.pack(side="left")
            
            rating = anime['rating']
            stars = "⭐" * int(rating // 2) + "☆" * (5 - int(rating // 2))
            rating_label = ctk.CTkLabel(info_row, text=f"{stars} {rating:.1f}/10", font=("Segoe UI", 12), text_color="#FFD700")
            rating_label.pack(side="right")
            
            if anime['notes'] and anime['notes'] != self.t("no_notes"):
                notes_frame = ctk.CTkFrame(inner, fg_color="gray20", corner_radius=12)
                notes_frame.pack(fill="x", pady=10)
                notes_label = ctk.CTkLabel(notes_frame, text=f"📝 {anime['notes'][:250]}{'...' if len(anime['notes']) > 250 else ''}", font=("Segoe UI", 11), text_color=theme["text_secondary"], wraplength=950, justify="left", padx=14, pady=10)
                notes_label.pack()
            
            actions = ctk.CTkFrame(inner, fg_color="transparent")
            actions.pack(fill="x", pady=(10, 0))
            actions_left = ctk.CTkFrame(actions, fg_color="transparent")
            actions_left.pack(side="left")
            
            if anime["status"] != "watching":
                AnimatedButton(actions_left, text=self.t("watching_btn"), command=lambda i=anime["id"]: self.update_status(i, "watching"), width=105, height=34, fg_color="#3498DB", hover_color="#2980B9", font=("Segoe UI", 10, "bold"), corner_radius=9).pack(side="left", padx=3)
            if anime["status"] != "completed":
                AnimatedButton(actions_left, text=self.t("completed_btn"), command=lambda i=anime["id"]: self.update_status(i, "completed"), width=105, height=34, fg_color="#2ECC71", hover_color="#27AE60", font=("Segoe UI", 10, "bold"), corner_radius=9).pack(side="left", padx=3)
            if anime["status"] != "planned":
                AnimatedButton(actions_left, text=self.t("plan_btn"), command=lambda i=anime["id"]: self.update_status(i, "planned"), width=105, height=34, fg_color="#F39C12", hover_color="#E67E22", font=("Segoe UI", 10, "bold"), corner_radius=9).pack(side="left", padx=3)
            
            AnimatedButton(actions_left, text=self.t("edit_notes"), command=lambda i=anime["id"], n=anime['notes']: self.edit_notes(i, n), width=115, height=34, fg_color="#9B59B6", hover_color="#8E44AD", font=("Segoe UI", 10), corner_radius=9).pack(side="left", padx=3)
            AnimatedButton(actions, text=self.t("delete"), command=lambda i=anime["id"], n=anime["name"]: self.delete_anime(i, n), width=95, height=34, fg_color="#E74C3C", hover_color="#C0392B", font=("Segoe UI", 10, "bold"), corner_radius=9).pack(side="right")
            
            date_text = f"📅 {self.t('added')}: {anime.get('date_added', 'Unknown')}"
            if anime.get('date_modified') != anime.get('date_added'):
                date_text += f"  ✏️ {self.t('modified')}: {anime['date_modified']}"
            date_label = ctk.CTkLabel(inner, text=date_text, font=("Segoe UI", 9), text_color="gray45")
            date_label.pack(anchor="w", pady=(10, 0))
            
    def clear_form(self):
        self.name_entry.delete(0, "end")
        self.genre_var.set("Select Genre")
        self.status_var.set("watching")
        self.rating_slider.set(0)
        self.rating_value.configure(text="⭐ 0.0")
        self.notes_text.delete("1.0", "end")
        self.clear_btn.configure(fg_color="#2ECC71")
        self.window.after(200, lambda: self.clear_btn.configure(fg_color="gray32"))
        
    def run(self):
        self.window.mainloop()


if __name__ == "__main__":
    app = AniDiary()
    app.run()