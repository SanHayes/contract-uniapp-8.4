import i18n from '@/locale'

/**
 * 地址打码
 * @param address
 * @returns {string}
 */
export function maskAddr(address) {
    if (address !== i18n.t(`connect`)) {
        return address.substring(0, 5) + '***' + address.substring(address.length - 5, address.length)
    }
    return address
}