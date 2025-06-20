# Fullstack Start Template - Refactoring Plan

## 📋 Overview

This document outlines a comprehensive refactoring plan for the fullstack-start-template based on codebase analysis and adherence to project standards.

**Project Standards:**
- **Code Style**: Prettier (single quotes, semicolons, trailing commas)
- **Linting**: Biome for code quality and formatting
- **TypeScript**: Strict mode with comprehensive type safety
- **Framework**: TanStack Start with React 19
- **UI**: Tailwind CSS with shadcn/ui components
- **State**: TanStack Query + React hooks
- **Authentication**: Better Auth

## 🎯 Refactoring Goals

1. **Improve Maintainability**: Break down large components into smaller, focused units
2. **Enhance Type Safety**: Eliminate `any` types and `@ts-ignore` comments
3. **Standardize Patterns**: Create consistent error handling, loading states, and form patterns
4. **Optimize Performance**: Implement memoization and code splitting
5. **Improve Accessibility**: Add proper ARIA attributes and keyboard navigation
6. **Reduce Technical Debt**: Eliminate code duplication and improve architecture

## 🏗 Architecture Improvements

### Current Structure Analysis
```
src/
├── components/          # Shared UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── routes/             # File-based routing (TanStack Router)
└── server/             # Server-side code (tRPC, auth)
```

### Proposed Structure Enhancement
```
src/
├── components/
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── forms/          # Reusable form components
│   ├── layout/         # Layout-specific components
│   └── features/       # Feature-specific components
├── features/           # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── settings/
│   └── ai-chat/
├── hooks/
│   ├── api/            # API-related hooks
│   ├── ui/             # UI-related hooks
│   └── shared/         # Shared business logic hooks
├── lib/
│   ├── api/            # API clients and configs
│   ├── auth/           # Authentication logic
│   ├── db/             # Database schemas and utils
│   ├── errors/         # Error handling utilities
│   ├── utils/          # General utilities
│   └── validators/     # Zod schemas and validation
└── types/              # Shared TypeScript types
```

## 🚨 Critical Issues to Address

### 1. Large Component Files (High Priority)
**Files requiring immediate attention:**

#### `/src/routes/dashboard/settings/-components/user-card.tsx` (447 lines)
**Issues:**
- Single component handling multiple responsibilities
- Complex state management with multiple useState hooks
- Mixed UI and business logic
- Difficult to test and maintain

**Refactoring Plan:**
```typescript
// Break into smaller components:
UserCard/
├── index.tsx                    # Main container (50-80 lines)
├── UserProfile.tsx             # User info display
├── SessionManager.tsx          # Active sessions management
├── TwoFactorSettings.tsx       # 2FA configuration
├── PasskeySettings.tsx         # Passkey management
├── EmailVerification.tsx       # Email verification UI
└── types.ts                    # Component-specific types
```

#### `/src/components/ai-chat-rag.tsx` (400+ lines)
**Issues:**
- Massive component with multiple responsibilities
- Complex state management
- Inline logic that should be extracted

**Refactoring Plan:**
```typescript
AIChatRag/
├── index.tsx                   # Main container
├── ChatInterface.tsx           # Chat UI
├── MessageList.tsx            # Message display
├── MessageInput.tsx           # Input component
├── DocumentSelector.tsx       # RAG document selection
├── hooks/
│   ├── useChat.ts             # Chat logic
│   ├── useRAG.ts              # RAG functionality
│   └── useMessages.ts         # Message management
└── types.ts                   # Chat-specific types
```

### 2. Type Safety Issues (High Priority)

#### Current Issues:
```typescript
// Found in auth hooks and components
any // Used in multiple places
//@ts-ignore // Found in user-card.tsx:349
```

**Solutions:**
```typescript
// lib/types/auth.ts
export type AuthError = 
  | { type: 'INVALID_CREDENTIALS'; message: string; field?: string }
  | { type: 'NETWORK_ERROR'; message: string; retryable: boolean }
  | { type: 'VALIDATION_ERROR'; fields: Record<string, string[]> }
  | { type: 'PERMISSION_ERROR'; message: string; requiredRole: string }
  | { type: 'RATE_LIMIT_ERROR'; message: string; retryAfter: number };

export type LoginResult = 
  | { success: true; user: User; session: Session }
  | { success: false; error: AuthError };

// hooks/auth/useLogin.ts
export const useLogin = (): {
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  isLoading: boolean;
  error: AuthError | null;
} => {
  // Implementation with proper types
};
```

### 3. Error Handling Standardization (High Priority)

#### Current Issues:
- Inconsistent error display (toast, alerts, console.log)
- No centralized error handling
- Missing error boundaries

**Proposed Solution:**
```typescript
// lib/errors/app-error.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }

  static fromApiError(apiError: any): AppError {
    // Parse API errors into standardized format
  }
}

// lib/errors/error-boundary.tsx
export class ErrorBoundary extends Component<Props, State> {
  // Global error boundary implementation
}

// hooks/use-error-handler.ts
export const useErrorHandler = () => {
  const navigate = useNavigate();
  
  return useCallback((error: unknown) => {
    if (error instanceof AppError) {
      switch (error.code) {
        case 'AUTH_REQUIRED':
          navigate({ to: '/login' });
          break;
        case 'PERMISSION_DENIED':
          toast.error(error.message);
          break;
        default:
          toast.error(error.message);
      }
    } else {
      // Log to Sentry, show generic message
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  }, [navigate]);
};
```

## 🌐 Internationalization (i18n) Improvements

### Current Issues:
- Hardcoded text strings throughout components
- Inconsistent use of translation system
- Missing translation keys for error messages
- User-facing text not properly internationalized

### Found Hardcoded Strings Analysis:

**High Priority Files with Hardcoded Text:**
- `/src/routes/(auth)/-components/sign-in-form.tsx` - Login error messages
- `/src/routes/dashboard/settings/-components/user-card.tsx` - Settings success/error messages
- `/src/components/file-upload.tsx` - File upload UI text
- `/src/routes/dashboard/index.tsx` - Todo functionality text
- `/src/routes/(auth)/-components/register-form.tsx` - Validation messages

### Proposed Solution:
```typescript
// lib/intl/keys.ts - Centralized translation keys
export const TRANSLATION_KEYS = {
  // Error Messages
  LOGIN_FAILED: 'LOGIN_FAILED',
  PASSKEY_AUTH_FAILED: 'PASSKEY_AUTH_FAILED',
  SOCIAL_LOGIN_FAILED: 'SOCIAL_LOGIN_FAILED',
  GENERIC_ERROR_RETRY: 'GENERIC_ERROR_RETRY',
  PASSWORD_MIN_LENGTH_8: 'PASSWORD_MIN_LENGTH_8',
  PASSWORDS_NO_MATCH: 'PASSWORDS_NO_MATCH',
  
  // UI Labels
  COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
  COPIED: 'COPIED',
  PROCESSING: 'PROCESSING',
  UPLOAD_FILE: 'UPLOAD_FILE',
  
  // File Upload
  PDF_SIZE_LIMIT_ERROR: 'PDF_SIZE_LIMIT_ERROR',
  SAFARI_DRAG_DROP_ERROR: 'SAFARI_DRAG_DROP_ERROR',
  
  // Validation
  NAME_MIN_LENGTH_2: 'NAME_MIN_LENGTH_2',
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
} as const;

// Usage example:
const { t } = useTranslation();
return <p>{t(TRANSLATION_KEYS.LOGIN_FAILED)}</p>;
```

### Translation Files to Update:
```json
// src/lib/intl/locales/en.json
{
  "LOGIN_FAILED": "Login failed. Please check your credentials and try again.",
  "PASSKEY_AUTH_FAILED": "Passkey authentication failed. Please try again.",
  "SOCIAL_LOGIN_FAILED": "Social login failed. Please try again.",
  "PASSWORD_MIN_LENGTH_8": "Password must be at least 8 characters",
  "PASSWORDS_NO_MATCH": "Passwords do not match",
  "COPY_TO_CLIPBOARD": "Copy to clipboard",
  "COPIED": "Copied!",
  "PDF_SIZE_LIMIT_ERROR": "Only PDF files under 5MB are allowed.",
  "SAFARI_DRAG_DROP_ERROR": "Safari does not support drag & drop. Please use the file picker.",
  "NAME_MIN_LENGTH_2": "Name must be at least 2 characters",
  "INVALID_EMAIL_FORMAT": "Please enter a valid email address"
}
```

### Implementation Plan:
1. **Create translation key constants** for type safety
2. **Update all hardcoded strings** to use translation system
3. **Add missing keys** to locale files  
4. **Create validation** to ensure no hardcoded user-facing strings
5. **Add translation coverage** for Spanish, Portuguese, etc.

## 🔧 Component Architecture Improvements

### 1. Form Pattern Standardization

**Current Issues:**
- Repeated form logic across auth components
- Inconsistent validation patterns
- Manual state management

**Proposed Solution:**
```typescript
// components/forms/form-field.tsx
interface FormFieldProps<T> {
  name: keyof T;
  label: string;
  type?: 'text' | 'email' | 'password';
  validation?: ZodSchema;
  placeholder?: string;
  description?: string;
  required?: boolean;
}

export const FormField = <T,>({ name, label, ...props }: FormFieldProps<T>) => {
  // Standardized form field with validation
};

// hooks/forms/use-form-submission.ts
export const useFormSubmission = <T, R>(
  schema: ZodSchema<T>,
  submitFn: (data: T) => Promise<R>,
  options?: {
    onSuccess?: (result: R) => void;
    onError?: (error: Error) => void;
    resetOnSuccess?: boolean;
  }
) => {
  // Standardized form submission logic
};
```

### 2. Loading State Standardization

**Current Issues:**
- Inconsistent loading button implementations
- Manual loading state management

**Proposed Solution:**
```typescript
// components/ui/loading-button.tsx
interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
}

export const LoadingButton = ({ 
  isLoading, 
  loadingText, 
  children, 
  icon,
  disabled,
  ...props 
}: LoadingButtonProps) => (
  <Button disabled={disabled || isLoading} {...props}>
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText || 'Loading...'}
      </>
    ) : (
      <>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </>
    )}
  </Button>
);
```

## 🚀 Performance Optimizations

### 1. Component Memoization
```typescript
// Memoize expensive components
export const UserCard = memo(({ activeSessions }: Props) => {
  const memoizedSessions = useMemo(
    () => activeSessions.filter(session => session.isActive),
    [activeSessions]
  );
  
  // Component implementation
});

// Memoize expensive calculations
const breadcrumbs = useMemo(() => 
  pathname.split('/').filter(Boolean).map((segment, index, arr) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    href: '/' + arr.slice(0, index + 1).join('/'),
  })),
  [pathname]
);
```

### 2. Code Splitting
```typescript
// Lazy load heavy components
const AIChatRag = lazy(() => import('./components/features/ai-chat/AIChatRag'));
const AdminDashboard = lazy(() => import('./routes/dashboard/settings/-components/admin'));

// Route-level code splitting
export const Route = createFileRoute('/dashboard/ai-chat')({
  component: () => (
    <Suspense fallback={<LoadingSkeleton />}>
      <AIChatRag />
    </Suspense>
  ),
});
```

## ♿ Accessibility Improvements

### 1. Form Accessibility
```typescript
// Enhanced form field with proper ARIA
export const FormField = ({ name, label, error, required, ...props }) => (
  <div className="space-y-2">
    <Label 
      htmlFor={name}
      className={required ? "after:content-['*'] after:text-red-500" : ""}
    >
      {label}
    </Label>
    <Input
      id={name}
      name={name}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      aria-required={required}
      {...props}
    />
    {error && (
      <p id={`${name}-error`} className="text-sm text-red-500" role="alert">
        {error}
      </p>
    )}
  </div>
);
```

### 2. Modal Accessibility
```typescript
// Enhanced dialog with focus management
export const Dialog = ({ children, ...props }) => (
  <RadixDialog.Root {...props}>
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/50" />
      <RadixDialog.Content
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        onOpenAutoFocus={(e) => {
          // Focus first interactive element
        }}
        onCloseAutoFocus={(e) => {
          // Return focus to trigger element
        }}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);
```

## 📊 Code Quality Metrics

### Before Refactoring:
- **Large Components**: 3 files >400 lines
- **Type Safety Issues**: 5+ `any` types, 2 `@ts-ignore`
- **Code Duplication**: ~30% duplicated patterns
- **Test Coverage**: Minimal
- **Bundle Size**: ~2.5MB (unoptimized)

### After Refactoring Goals:
- **Component Size**: Max 150 lines per component
- **Type Safety**: Zero `any` types in application code
- **Code Duplication**: <10%
- **Test Coverage**: >80% for critical paths
- **Bundle Size**: <2MB with code splitting

## 🗓 Implementation Timeline

### Phase 1: Foundation (Week 1-2)
1. Set up error handling infrastructure
2. Create reusable form components
3. Implement type safety improvements
4. Add error boundaries
5. **Internationalization setup** - Create translation key constants and update hardcoded strings

### Phase 2: Component Refactoring (Week 3-4)
1. Break down UserCard component
2. Refactor AIChatRag component
3. Implement loading state standardization
4. Add component memoization
5. **Complete i18n migration** - Replace all hardcoded text with translations

### Phase 3: Performance & Polish (Week 5-6)
1. Implement code splitting
2. Add accessibility improvements
3. Performance optimizations
4. Documentation updates
5. **Multi-language support** - Add Spanish/Portuguese translations

### Phase 4: Testing & Validation (Week 7)
1. Add comprehensive tests
2. Performance testing
3. Accessibility audit
4. Code review and refinement
5. **Translation validation** - Ensure no hardcoded user-facing strings remain

## 📝 Success Criteria

- [ ] All components <150 lines
- [ ] Zero `any` types in application code
- [ ] Consistent error handling across all features
- [ ] >80% test coverage for critical paths
- [ ] <2MB bundle size with lazy loading
- [ ] WCAG 2.1 AA compliance
- [ ] All TypeScript strict mode warnings resolved
- [ ] Biome linting passes with zero warnings
- [ ] **Zero hardcoded user-facing strings** - All text properly internationalized
- [ ] **Translation coverage** - Complete English translations, partial Spanish/Portuguese
- [ ] **Type-safe translations** - Translation keys defined as constants

## 🔍 Monitoring & Metrics

**Code Quality:**
- TypeScript strict mode compliance
- Biome linting score
- Bundle analyzer reports
- Component complexity metrics

**Performance:**
- Core Web Vitals
- Bundle size tracking
- Render performance profiling
- Network request optimization

**User Experience:**
- Accessibility audit scores
- Error rate monitoring
- User feedback on new patterns

---

*This document will be updated as refactoring progresses. Each phase should be completed with proper testing and code review.*