import { useFocusStates } from '@/hooks';

export function useNavbar() {
    const { focusStates, createFocusHandlers } = useFocusStates([
        'theme', 'notif', 'user', 'add'
    ]);

    return {
        // Estados individuales (compatibilidad hacia atrás)
        themeFocused: focusStates.theme,
        notifFocused: focusStates.notif,
        userFocused: focusStates.user,
        addFocused: focusStates.add,
        
        // Handlers automáticos
        themeHandlers: createFocusHandlers('theme'),
        notifHandlers: createFocusHandlers('notif'),
        userHandlers: createFocusHandlers('user'),
        addHandlers: createFocusHandlers('add')
    };
};