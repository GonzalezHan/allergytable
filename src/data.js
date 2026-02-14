export const allergensList = [
    { id: 'egg', name: '계란', icon: '🥚', activeName: 'Egg', enName: 'Egg', jaName: '卵', zhName: '鸡蛋' },
    { id: 'peanut', name: '땅콩', icon: '🥜', activeName: 'Peanut', enName: 'Peanut', jaName: 'ピーナッツ', zhName: '花生' },
    { id: 'dairy', name: '유제품', icon: '🥛', activeName: 'Dairy', enName: 'Dairy', jaName: '乳製品', zhName: '乳制品' },
    { id: 'wheat', name: '밀', icon: '🌾', activeName: 'Wheat', enName: 'Wheat', jaName: '小麦', zhName: '小麦' },
    { id: 'soy', name: '대두', icon: '🫘', activeName: 'Soy', enName: 'Soy', jaName: '大豆', zhName: '大豆' },
    { id: 'shellfish', name: '갑각류', icon: '🦐', activeName: 'Shellfish', enName: 'Shellfish', jaName: '甲殻類', zhName: '甲壳类' },
    { id: 'fish', name: '생선', icon: '🐟', activeName: 'Fish', enName: 'Fish', jaName: '魚', zhName: '鱼' },
    { id: 'crab', name: '게', icon: '🦀', activeName: 'Crab', enName: 'Crab', jaName: 'カニ', zhName: '蟹' },
    { id: 'fruit', name: '과일', icon: '🍇', activeName: 'Fruit', enName: 'Fruit', jaName: '果物', zhName: '水果' },
    { id: 'other', name: '기타', icon: '🥗', activeName: 'Other', enName: 'Other', jaName: 'その他', zhName: '其他' },
];

export const severityLevels = [
    { id: 'mild', name: '경미', color: '#4CAF50' },
    { id: 'warning', name: '주의', color: '#FF9800' },
    { id: 'severe', name: '심각', color: '#F44336' },
];

export const categories = [
    { id: 'korean', name: '한식', icon: '🍚' },
    { id: 'japanese', name: '일식', icon: '🍣' },
    { id: 'chinese', name: '중식', icon: '🥟' },
    { id: 'western', name: '양식', icon: '🍝' },
    { id: 'cafe', name: '카페', icon: '☕' },
    { id: 'vegan', name: '비건', icon: '🥗' },
];

export const mockRestaurants = [
    {
        id: 1,
        name: "비건 키친 (Vegan Kitchen)",
        type: "비건 레스토랑",
        location: "강남구 역삼동",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        safeFor: ['egg', 'dairy', 'shellfish', 'fish', 'crab'],
        rating: 4.8,
        reviews: 124
    },
    {
        id: 2,
        name: "쌀국수 정원 (Pho Garden)",
        type: "베트남 음식",
        location: "서초구 서초동",
        image: "https://images.unsplash.com/photo-1582878826618-c05326eff935?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        safeFor: ['dairy', 'wheat'],
        rating: 4.5,
        reviews: 89
    },
    {
        id: 3,
        name: "글루텐프리 베이커리 (GF Bakery)",
        type: "카페 & 베이커리",
        location: "강남구 신사동",
        image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        safeFor: ['wheat', 'egg', 'dairy'],
        rating: 4.9,
        reviews: 210
    },
    {
        id: 4,
        name: "바다 향기 (Sea Scent)",
        type: "해산물 전문점",
        location: "송파구 잠실동",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        safeFor: ['peanut', 'soy'],
        rating: 4.2,
        reviews: 56
    }
];
