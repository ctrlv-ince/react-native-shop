// Gaming Store Theme - Light theme with vibrant gaming accents
export const COLORS = {
    // Backgrounds
    background: '#F5F5FA',
    white: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#EEEEF5',

    // Primary & Accent
    primary: '#4F46E5',       // Indigo / electric blue
    primaryLight: '#EEF2FF',  // Light primary wash
    accent: '#06B6D4',        // Teal cyan
    accentLight: '#ECFEFF',   // Light accent wash

    // Status
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    gold: '#F59E0B',

    // Text
    text: '#1E1E2E',
    textMuted: '#6B7280',
    textLight: '#9CA3AF',

    // Borders & Inputs
    border: '#E5E7EB',
    inputBg: '#F9FAFB',
    inputBorder: '#D1D5DB',

    // Tab bar
    tabBarBg: '#FFFFFF',
    tabActive: '#4F46E5',
    tabInactive: '#9CA3AF',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
};

export const RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
    },
};

// Common reusable styles
export const COMMON_STYLES = {
    screenContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.base,
        ...SHADOWS.medium,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
    },
    bodyText: {
        fontSize: 14,
        color: COLORS.text,
    },
    mutedText: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    input: {
        width: '100%',
        height: 52,
        backgroundColor: COLORS.inputBg,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.base,
        borderWidth: 1.5,
        borderColor: COLORS.inputBorder,
        fontSize: 15,
        color: COLORS.text,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
    dangerButton: {
        backgroundColor: COLORS.danger,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.base,
        borderRadius: RADIUS.sm,
        alignItems: 'center',
    },
    dangerButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    outlineButton: {
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    outlineButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
};

// Stack navigator header options (light gaming theme)
export const STACK_HEADER_STYLE = {
    headerStyle: {
        backgroundColor: COLORS.white,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    headerTintColor: COLORS.primary,
    headerTitleStyle: {
        fontWeight: '700',
        color: COLORS.text,
        fontSize: 18,
    },
};
