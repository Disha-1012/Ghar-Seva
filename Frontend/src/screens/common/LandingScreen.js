import React, { useEffect, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    SafeAreaView,
    StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const GharSevaLandingPremium = () => {
    const navigation = useNavigation();

    // --- Animations ---
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const heroTranslateY = useRef(new Animated.Value(40)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const badgeScale = useRef(new Animated.Value(0.8)).current;
    const cardAnims = useRef([...Array(4)].map(() => new Animated.Value(0))).current;
    const statAnims = useRef([...Array(3)].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(headerOpacity, {
                toValue: 1,
                duration: 900,
                useNativeDriver: true,
            }),
            Animated.spring(heroTranslateY, {
                toValue: 0,
                friction: 8,
                tension: 35,
                useNativeDriver: true,
            }),
            Animated.spring(badgeScale, {
                toValue: 1,
                friction: 6,
                tension: 60,
                useNativeDriver: true,
            }),
        ]).start(() => {
            Animated.stagger(120,
                [...cardAnims, ...statAnims].map((anim) =>
                    Animated.spring(anim, {
                        toValue: 1,
                        friction: 7,
                        tension: 45,
                        useNativeDriver: true,
                    })
                )
            ).start();
        });

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const topFeatures = [
        { id: '1', title: 'Negotiate Freely', icon: '🤝', desc: 'Set fair rates directly with pros.', color: '#e0f2fe', iconBg: '#0ea5e9' },
        { id: '2', title: 'Rent Any Tool', icon: '🛠️', desc: 'Skip buying — rent what you need.', color: '#fff7ed', iconBg: '#f97316' },
        { id: '3', title: 'Verified Experts', icon: '🛡️', desc: '100% background checked pros.', color: '#f0fdf4', iconBg: '#22c55e' },
        { id: '4', title: 'Instant Booking', icon: '⚡', desc: 'Same-day service, always on time.', color: '#fdf4ff', iconBg: '#a855f7' },
    ];

    const ecosystemFeatures = [
        {
            id: '0',
            title: 'Empowering Local Workers',
            desc: 'Fair earnings directly to the hands that build and fix our homes.',
            image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400',
            tag: 'Community',
            tagColor: '#0ea5e9',
        },
        {
            id: '1',
            title: 'Reaching Smaller Towns',
            desc: 'Bringing premium, reliable home services beyond the big cities.',
            image: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=400',
            tag: 'Reach',
            tagColor: '#f97316',
        },
        {
            id: '2',
            title: 'Save on Equipment',
            desc: 'Why buy a drill for one hole? Rent tools instantly from nearby.',
            image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=400',
            tag: 'Smart',
            tagColor: '#22c55e',
        },
        {
            id: '3',
            title: 'Balanced Ecosystem',
            desc: 'A platform built on mutual respect and transparent practices.',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400',
            tag: 'Trust',
            tagColor: '#a855f7',
        },
    ];

    const stats = [
        { value: '50K+', label: 'Happy Homes', icon: '🏠' },
        { value: '3K+', label: 'Verified Pros', icon: '👷' },
        { value: '98%', label: 'Satisfaction', icon: '⭐' },
    ];

    const services = [
        { icon: '🔌', label: 'Electrical' },
        { icon: '🚰', label: 'Plumbing' },
        { icon: '🎨', label: 'Painting' },
        { icon: '❄️', label: 'AC Repair' },
        { icon: '🧹', label: 'Cleaning' },
        { icon: '🪚', label: 'Carpentry' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0e5ee9" />

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

                {/* ══════════════ HERO SECTION ══════════════ */}
                <Animated.View style={[styles.heroSection, {
                    opacity: headerOpacity,
                    transform: [{ translateY: heroTranslateY }]
                }]}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1000' }}
                        style={styles.heroBgImage}
                    />
                    {/* Dark gradient overlay */}
                    <View style={styles.heroGradientOverlay} />
                    {/* Sky-blue tint overlay */}
                    <View style={styles.heroTintOverlay} />

                    <View style={styles.heroOverlay}>
                        {/* ── Navbar ── */}
                        <View style={styles.navBar}>
                            <View style={styles.navLogoRow}>
                                <View style={styles.logoRing}>
                                    <Image
                                        source={require("../../../assets/images/logo.jpeg")}
                                        style={styles.logoImage}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View>
                                    <Text style={styles.navBrand}>GharSeva</Text>
                                    <Text style={styles.navTagline}>Your Home, Our Pride</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.navLoginBtn}
                                onPress={() => navigation.navigate("Login")}
                            >
                                <Text style={styles.navLoginText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>

                        {/* ── Hero Copy ── */}
                        <View style={styles.heroContent}>
                            <Animated.View style={[styles.trustBadge, { transform: [{ scale: badgeScale }] }]}>
                                <Text style={styles.trustBadgeDot}>●</Text>
                                <Text style={styles.trustBadgeText}>  Trusted by 50,000+ Households</Text>
                            </Animated.View>

                            <Text style={styles.heroTitle}>
                                Smart Home{'\n'}Services for{'\n'}
                                <Text style={styles.heroTitleAccent}>Everyone.</Text>
                            </Text>

                            <Text style={styles.heroSubtitle}>
                                Fair prices, local empowerment, and smart tool rentals — in every town across India.
                            </Text>

                            {/* CTA Row */}
                            <View style={styles.ctaRow}>
                                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                    <TouchableOpacity
                                        style={styles.primaryCta}
                                        activeOpacity={0.9}
                                        onPress={() => navigation.navigate("Login")}
                                    >
                                        <Text style={styles.primaryCtaText}>Get Started  →</Text>
                                    </TouchableOpacity>
                                </Animated.View>

                                <TouchableOpacity
                                    style={styles.secondaryCtaOutline}
                                    onPress={() => navigation.navigate("Register")}
                                >
                                    <Text style={styles.secondaryCtaOutlineText}>Join as Pro</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Bottom curved mask */}
                    <View style={styles.heroCurve} />
                </Animated.View>

                {/* ══════════════ STATS STRIP ══════════════ */}
                <View style={styles.statsStrip}>
                    {stats.map((stat, i) => {
                        const opacity = statAnims[i];
                        const translateY = statAnims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
                        return (
                            <Animated.View
                                key={i}
                                style={[styles.statItem, { opacity, transform: [{ translateY }] }]}
                            >
                                <Text style={styles.statIcon}>{stat.icon}</Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* ══════════════ QUICK FEATURE CARDS ══════════════ */}
                <View style={styles.sectionWrapper}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.sectionPill} />
                        <Text style={styles.sectionHeader}>Why GharSeva?</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.quickFeaturesScroll}
                    >
                        {topFeatures.map((item) => (
                            <View key={item.id} style={[styles.quickFeatureCard, { backgroundColor: item.color }]}>
                                <View style={[styles.featureIconCircle, { backgroundColor: item.iconBg }]}>
                                    <Text style={styles.featureIconText}>{item.icon}</Text>
                                </View>
                                <Text style={styles.quickFeatureTitle}>{item.title}</Text>
                                <Text style={styles.quickFeatureDesc}>{item.desc}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* ══════════════ SERVICES GRID ══════════════ */}
                <View style={styles.servicesSection}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={[styles.sectionPill, { backgroundColor: '#f97316' }]} />
                        <Text style={styles.sectionHeader}>Our Services</Text>
                    </View>
                    <View style={styles.servicesGrid}>
                        {services.map((s, i) => (
                            <TouchableOpacity key={i} style={styles.serviceChip} activeOpacity={0.8}>
                                <Text style={styles.serviceChipIcon}>{s.icon}</Text>
                                <Text style={styles.serviceChipLabel}>{s.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ══════════════ ECOSYSTEM CARDS ══════════════ */}
                <View style={styles.ecosystemSection}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={[styles.sectionPill, { backgroundColor: '#22c55e' }]} />
                        <Text style={styles.sectionHeader}>Building a Better Ecosystem</Text>
                    </View>

                    <View style={styles.gridContainer}>
                        {ecosystemFeatures.map((feature, index) => {
                            const scale = cardAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });
                            const opacity = cardAnims[index];
                            return (
                                <Animated.View
                                    key={feature.id}
                                    style={[styles.gridCard, { opacity, transform: [{ scale }] }]}
                                >
                                    <Image source={{ uri: feature.image }} style={styles.cardImage} />
                                    {/* Tag badge */}
                                    <View style={[styles.cardTag, { backgroundColor: feature.tagColor }]}>
                                        <Text style={styles.cardTagText}>{feature.tag}</Text>
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardTitle}>{feature.title}</Text>
                                        <Text style={styles.cardDesc}>{feature.desc}</Text>
                                    </View>
                                </Animated.View>
                            );
                        })}
                    </View>
                </View>

                {/* ══════════════ TESTIMONIAL STRIP ══════════════ */}
                <View style={styles.testimonialStrip}>
                    <Text style={styles.testimonialQuote}>"Best home service app I've used. Fair pricing, quick booking, no hidden fees!"</Text>
                    <View style={styles.testimonialAuthorRow}>
                        <View style={styles.testimonialAvatar}>
                            <Text style={styles.testimonialAvatarText}>R</Text>
                        </View>
                        <View>
                            <Text style={styles.testimonialName}>Rajesh Kumar</Text>
                            <Text style={styles.testimonialLocation}>📍 Kolkata, WB</Text>
                        </View>
                        <View style={styles.testimonialStars}>
                            <Text style={styles.starsText}>★★★★★</Text>
                        </View>
                    </View>
                </View>

                {/* ══════════════ BOTTOM PROMO BANNER ══════════════ */}
                <View style={styles.bottomPromo}>
                    <View style={styles.promoCircle1} />
                    <View style={styles.promoCircle2} />
                    <Text style={styles.promoEyebrow}>LIMITED TIME OFFER</Text>
                    <Text style={styles.promoTitle}>Your Home.{'\n'}Your Rules.</Text>
                    <Text style={styles.promoText}>
                        Join the revolution of transparent and accessible home services today.
                    </Text>
                    <TouchableOpacity
                        style={styles.promoCtaBtn}
                        onPress={() => navigation.navigate("Register")}
                        activeOpacity={0.88}
                    >
                        <Text style={styles.promoCtaText}>Join GharSeva Free  →</Text>
                    </TouchableOpacity>
                    <Text style={styles.promoDisclaimer}>No credit card required. Cancel anytime.</Text>
                </View>

                {/* ══════════════ FOOTER ══════════════ */}
                <View style={styles.footer}>
                    <Text style={styles.footerBrand}>GharSeva</Text>
                    <Text style={styles.footerTagline}>Making every home a better place.</Text>
                    <View style={styles.footerDivider} />
                    <Text style={styles.footerCopy}>© 2025 GharSeva. All rights reserved.</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f9ff',
    },

    /* ═══════════════ HERO ═══════════════ */
    heroSection: {
        height: 520,
        overflow: 'hidden',
        backgroundColor: '#0e2a6e',
        position: 'relative',
    },
    heroBgImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.28,
    },
    heroGradientOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(14,30,100,0.72)',
    },
    heroTintOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 180,
        backgroundColor: 'rgba(14,94,233,0.18)',
    },
    heroOverlay: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 22,
    },
    heroCurve: {
        position: 'absolute',
        bottom: -2,
        left: 0,
        right: 0,
        height: 42,
        backgroundColor: '#f0f9ff',
        borderTopLeftRadius: 44,
        borderTopRightRadius: 44,
    },

    /* ── Navbar ── */
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    navLogoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoRing: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    logoImage: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    navBrand: {
        fontSize: 18,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: 0.3,
    },
    navTagline: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    navLoginBtn: {
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.45)',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    navLoginText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    /* ── Hero Copy ── */
    heroContent: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 30,
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(14,165,233,0.18)',
        borderWidth: 1,
        borderColor: 'rgba(14,165,233,0.4)',
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginBottom: 18,
    },
    trustBadgeDot: {
        color: '#38bdf8',
        fontSize: 10,
    },
    trustBadgeText: {
        color: '#7dd3fc',
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 0.3,
    },
    heroTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: '#ffffff',
        lineHeight: 50,
        marginBottom: 14,
        letterSpacing: -0.5,
    },
    heroTitleAccent: {
        color: '#f97316',
    },
    heroSubtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.72)',
        lineHeight: 23,
        marginBottom: 30,
        maxWidth: '88%',
        fontWeight: '400',
    },
    ctaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    primaryCta: {
        backgroundColor: '#f97316',
        paddingVertical: 15,
        paddingHorizontal: 28,
        borderRadius: 30,
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
    },
    primaryCtaText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    secondaryCtaOutline: {
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.4)',
        paddingVertical: 15,
        paddingHorizontal: 22,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    secondaryCtaOutlineText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },

    /* ═══════════════ STATS STRIP ═══════════════ */
    statsStrip: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 22,
        paddingVertical: 20,
        paddingHorizontal: 10,
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIcon: {
        fontSize: 22,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0e5ee9',
        letterSpacing: -0.3,
    },
    statLabel: {
        fontSize: 11,
        color: '#7ec8e8',
        fontWeight: '600',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    /* ═══════════════ SECTION WRAPPERS ═══════════════ */
    sectionWrapper: {
        paddingTop: 32,
        paddingBottom: 4,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 22,
        marginBottom: 18,
        gap: 10,
    },
    sectionPill: {
        width: 5,
        height: 22,
        borderRadius: 3,
        backgroundColor: '#0ea5e9',
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0c2461',
        letterSpacing: -0.2,
    },

    /* ═══════════════ QUICK FEATURES ═══════════════ */
    quickFeaturesScroll: {
        paddingHorizontal: 18,
        paddingBottom: 10,
        gap: 14,
    },
    quickFeatureCard: {
        width: 160,
        padding: 20,
        borderRadius: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
    },
    featureIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    featureIconText: {
        fontSize: 22,
    },
    quickFeatureTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0c2461',
        marginBottom: 6,
        letterSpacing: -0.1,
    },
    quickFeatureDesc: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 18,
        fontWeight: '400',
    },

    /* ═══════════════ SERVICES GRID ═══════════════ */
    servicesSection: {
        paddingTop: 28,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 18,
        gap: 12,
    },
    serviceChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1.5,
        borderColor: '#e0f2fe',
    },
    serviceChipIcon: {
        fontSize: 18,
    },
    serviceChipLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0c4a6e',
        letterSpacing: 0.2,
    },

    /* ═══════════════ ECOSYSTEM GRID ═══════════════ */
    ecosystemSection: {
        paddingTop: 32,
        paddingBottom: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        gap: 16,
    },
    gridCard: {
        width: (width - 52) / 2,
        backgroundColor: '#ffffff',
        borderRadius: 22,
        overflow: 'hidden',
        shadowColor: '#0e5ee9',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: 130,
    },
    cardTag: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    cardTagText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    cardContent: {
        padding: 14,
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#0c2461',
        marginBottom: 6,
        lineHeight: 18,
        letterSpacing: -0.1,
    },
    cardDesc: {
        fontSize: 11,
        color: '#64748b',
        lineHeight: 16,
    },

    /* ═══════════════ TESTIMONIAL ═══════════════ */
    testimonialStrip: {
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginTop: 28,
        borderRadius: 24,
        padding: 24,
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 6,
        borderLeftWidth: 4,
        borderLeftColor: '#f97316',
    },
    testimonialQuote: {
        fontSize: 14,
        color: '#334155',
        lineHeight: 22,
        fontStyle: 'italic',
        fontWeight: '500',
        marginBottom: 16,
    },
    testimonialAuthorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    testimonialAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#0e5ee9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    testimonialAvatarText: {
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 16,
    },
    testimonialName: {
        fontSize: 13,
        fontWeight: '800',
        color: '#0c2461',
    },
    testimonialLocation: {
        fontSize: 11,
        color: '#7ec8e8',
        fontWeight: '500',
    },
    testimonialStars: {
        marginLeft: 'auto',
    },
    starsText: {
        color: '#f97316',
        fontSize: 16,
        letterSpacing: 1,
    },

    /* ═══════════════ BOTTOM PROMO ═══════════════ */
    bottomPromo: {
        backgroundColor: '#0e5ee9',
        margin: 20,
        marginTop: 32,
        padding: 34,
        borderRadius: 32,
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#0e5ee9',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 12,
    },
    promoCircle1: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.06)',
        top: -50,
        right: -40,
    },
    promoCircle2: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(249,115,22,0.14)',
        bottom: -30,
        left: -20,
    },
    promoEyebrow: {
        fontSize: 10,
        color: '#7dd3fc',
        fontWeight: '800',
        letterSpacing: 2.5,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    promoTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 14,
        letterSpacing: -0.5,
        lineHeight: 40,
    },
    promoText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.72)',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 21,
        fontWeight: '400',
        maxWidth: '85%',
    },
    promoCtaBtn: {
        backgroundColor: '#f97316',
        paddingVertical: 16,
        paddingHorizontal: 34,
        borderRadius: 30,
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 14,
        elevation: 8,
        marginBottom: 14,
    },
    promoCtaText: {
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.3,
    },
    promoDisclaimer: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.45)',
        fontWeight: '500',
    },

    /* ═══════════════ FOOTER ═══════════════ */
    footer: {
        alignItems: 'center',
        paddingVertical: 28,
        paddingHorizontal: 24,
    },
    footerBrand: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0e5ee9',
        letterSpacing: 0.3,
        marginBottom: 4,
    },
    footerTagline: {
        fontSize: 12,
        color: '#7ec8e8',
        fontWeight: '500',
        marginBottom: 16,
    },
    footerDivider: {
        width: 50,
        height: 2,
        backgroundColor: '#e0f2fe',
        borderRadius: 2,
        marginBottom: 14,
    },
    footerCopy: {
        fontSize: 11,
        color: '#b0c4d8',
        fontWeight: '500',
    },
});

export default GharSevaLandingPremium;