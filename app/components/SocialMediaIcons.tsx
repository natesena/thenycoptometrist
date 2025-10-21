'use client'

import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { trackSocialMediaClick } from '@/lib/analytics';

interface SocialMediaIconsProps {
  className?: string;
  iconSize?: number;
  location?: string;
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ 
  className = '', 
  iconSize = 24,
  location = 'unknown'
}) => {
  const handleSocialClick = (platform: string, url: string) => {
    trackSocialMediaClick({ 
      platform, 
      location, 
      page: window.location.pathname, 
      url 
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const socialLinks = [
    {
      platform: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/thenycoptometrist',
      color: 'hover:text-pink-600'
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/thenycoptometrist',
      color: 'hover:text-blue-600'
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/thenycoptometrist',
      color: 'hover:text-blue-400'
    }
  ];

  return (
    <div className={`flex space-x-4 ${className}`}>
      {socialLinks.map(({ platform, icon: Icon, url, color }) => (
        <button
          key={platform}
          onClick={() => handleSocialClick(platform, url)}
          className={`text-gray-600 ${color} transition-colors duration-300 hover:scale-110 transform transition-transform`}
          aria-label={`Follow us on ${platform}`}
        >
          <Icon size={iconSize} />
        </button>
      ))}
    </div>
  );
};

export default SocialMediaIcons;