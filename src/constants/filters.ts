import { Filter } from '@/types';

// PRD에 정의된 10가지 컬러 필터
export const FILTERS: Filter[] = [
  // 골드 톤 (샴페인 컬러)
  {
    id: 'gold-light',
    name: 'Gold Light',
    color: '#A87932',
    category: 'gold',
  },
  {
    id: 'gold-medium',
    name: 'Gold Medium',
    color: '#C89B55',
    category: 'gold',
  },
  {
    id: 'gold-dark',
    name: 'Gold Dark',
    color: '#705430',
    category: 'gold',
  },
  
  // 딥 블루/그린 톤 (프리미엄 톤)
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    color: '#191970',
    category: 'blue-green',
  },
  {
    id: 'deep-teal',
    name: 'Deep Teal',
    color: '#004D40',
    category: 'blue-green',
  },
  {
    id: 'navy-blue',
    name: 'Navy Blue',
    color: '#003153',
    category: 'blue-green',
  },
  
  // 그린 톤 (자연/우아함)
  {
    id: 'forest-green',
    name: 'Forest Green',
    color: '#228B22',
    category: 'green',
  },
  {
    id: 'olive-green',
    name: 'Olive Green',
    color: '#556B2F',
    category: 'green',
  },
  {
    id: 'dark-cyan',
    name: 'Dark Cyan',
    color: '#005B4B',
    category: 'green',
  },
  
  // 크로마키 옵션
  {
    id: 'chroma-green',
    name: 'Chroma Green',
    color: '#00FF00',
    category: 'chroma',
  },
];

// 기본 필터 (첫 번째 골드 톤)
export const DEFAULT_FILTER = FILTERS[0];

// 인물 영역 색상 (블랙)
export const PERSON_COLOR = '#000000';

