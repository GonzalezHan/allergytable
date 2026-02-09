import React from 'react';
import { Coffee, Utensils, Pizza, Carrot } from 'lucide-react';

export const allergensList = [
    { id: 'egg', name: '계란', icon: '🥚' },
    { id: 'peanut', name: '땅콩', icon: '🥜' },
    { id: 'dairy', name: '유제품', icon: '🥛' },
    { id: 'wheat', name: '밀', icon: '🌾' },
    { id: 'soy', name: '대두', icon: '🫘' },
    { id: 'shellfish', name: '갑각류', icon: '🦐' },
];

export const categories = [
    { id: 'all', name: '전체', icon: <Utensils size={20} /> },
    { id: 'korean', name: '한식', icon: <div style={{ fontSize: '18px' }}>🍚</div> },
    { id: 'cafe', name: '카페', icon: <Coffee size={20} /> },
    { id: 'western', name: '양식', icon: <Pizza size={20} /> },
    { id: 'vegan', name: '비건', icon: <Carrot size={20} /> },
];

export const mockRestaurants = [
    {
        id: 1,
        name: '그린 베이커리',
        type: '카페/빵집',
        location: '강남구 역삼동',
        distance: '300m',
        rating: 4.8,
        reviewCount: 328,
        hours: '09:00 - 21:00',
        isOpen: true,
        canReserve: true,
        isCertified: true,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        safeFor: ['egg', 'peanut', 'dairy'],
        position: [37.5685, 126.9800],
        description: "매일 아침 구워내는 글루텐프리 빵과 비건 디저트가 있는 공간.",
        menu: [
            { name: '글루텐프리 브라우니', price: 5500, safeFor: ['wheat', 'egg'] },
            { name: '비건 당근케이크', price: 6000, safeFor: ['egg', 'dairy'] },
        ]
    },
    {
        id: 2,
        name: '비건 키친',
        type: '퓨전 한식',
        location: '중구 명동',
        distance: '850m',
        rating: 4.9,
        reviewCount: 512,
        hours: '11:00 - 22:00',
        isOpen: true,
        canReserve: false,
        isCertified: true,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        safeFor: ['dairy', 'wheat', 'soy', 'shellfish'],
        position: [37.5645, 126.9750],
        description: "모든 메뉴가 식물성 재료로 만들어진 건강한 퓨전 한식 다이닝.",
        menu: [
            { name: '두부스테이크', price: 15000, safeFor: ['dairy', 'egg'] },
            { name: '버섯불고기', price: 13000, safeFor: ['dairy', 'wheat'] },
        ]
    },
    {
        id: 3,
        name: '알러지 프리 파스타',
        type: '이탈리안',
        location: '마포구 서교동',
        distance: '1.2km',
        rating: 4.5,
        reviewCount: 120,
        hours: '11:00 - 21:00',
        isOpen: true,
        canReserve: true,
        isCertified: false,
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
        safeFor: ['egg', 'dairy', 'peanut'],
        position: [37.5550, 126.9200],
        description: "계란과 유제품 없이도 깊은 풍미를 내는 정통 이탈리안 파스타.",
        menu: [
            { name: '토마토 바질 파스타', price: 14000, safeFor: ['egg', 'dairy'] },
            { name: '알리오 올리오', price: 12000, safeFor: ['egg', 'dairy', 'peanut'] },
        ]
    }
];
