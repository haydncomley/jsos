export const useArgs = (rawArgs: string | undefined) => {
    const parts = (rawArgs ?? '').trim().split('\n').map((x) => x.trim()).filter(Boolean);
    const flags = parts.filter((x) => x.startsWith('--')).map((x) => x.replace('--', ''))
    const args = parts.filter((x) => !x.startsWith('--'))
    return { flags, args }
}