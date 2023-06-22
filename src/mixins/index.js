import Web3 from "web3";
import {mapGetters} from "vuex";
import comjs from "@/common/util"

export const commonMixin = {
    computed: {
        ...mapGetters([
            'address',
            'contracts',
            'isConnected',
            'walletLinkName',
            'walletLink',
            'walletLinkId',
            'walletIndex',
        ]),
    },
    data() {
        return {
            isauto: true,
            web3js: null,
            tronWeb: null,
        }
    },
    async onLoad() {
        await this.initWeb3()
        await this.connect()
    },
    methods: {
        async initWeb3(){
            if (window.ethereum && this.web3js === null) {
                this.web3js = new Web3(window.ethereum);
            }
        },
        async ethcontent_address() {
            console.log(`call ethcontent_address`)
            // 钱包地址
            const accounts = await this.web3js.eth.getAccounts();
            if (accounts.length >= 1 && accounts[0]) {
                let ctx = this.contracts[this.walletLink[this.walletIndex]]
                await this.$store.dispatch(`setAddress`, {
                    wallet_address: accounts[0],
                    smart_contract: ctx.smart_contract
                })
                await this.$store.dispatch(`setIsConnected`, true)
            }
        },
        // 钱包连接
        async connect() {
            console.log(`call ethcontent`)
            //检测是否以太环境
            const obj = setInterval(async () => {
                if (window.ethereum) {
                    console.log(`window.ethereum`)
                    clearInterval(obj);
                    if (this.web3js === null) {
                        this.web3js = new Web3(window.ethereum);
                    }
                    //@todo 这一步可能需要调整，在选择不同的链才触发
                    //链接钱包
                    await ethereum.request({method: 'eth_requestAccounts'}).catch(e => console.log(e));
                    await this.ethcontent_chain()
                } else if (window.tronWeb) {
                    console.log(`window.tronWeb`)
                    if (window.tronWeb.defaultAddress.base58) {
                        clearInterval(obj);
                        await this.$store.dispatch(`setAddress`, window.tronWeb.defaultAddress.base58)
                        await this.$store.dispatch(`setIsConnected`, true)
                        await this.$store.dispatch(`setWalletIndex`, 2)
                        this.tronWeb = window.tronWeb;
                    }
                } else {
                    console.log('not net')
                    clearInterval(obj);
                    if (!this.isauto) {
                        this.show_ethWallet_list()
                    }
                }
            }, 100);
        },
        chooselink() {
            console.log(`call chooselink`)
            //是否已连接
            if (this.isConnected) {
                return true;
            }
            this.isauto = false
            uni.showActionSheet({
                title: null,
                itemList: this.walletLinkName,
                success: async (res) => {
                    console.log(`chooselink res`, res)
                    await this.$store.dispatch(`setWalletIndex`, res.tapIndex)
                    if (this.walletLink[this.walletIndex] === 'trc') {
                        console.log(`trccontent`)
                        await this.trccontent()
                    } else {
                        console.log(`ethcontent`)
                        await this.connect()
                    }
                }
            })
        },
        async ethcontent_chain() {
            //获取链id
            console.log(`call ethcontent_chain`)
            try {
                const chainIdHex = await ethereum.request({
                    method: 'eth_chainId'
                });
                const chainId = Web3.utils.hexToNumber(chainIdHex)
                if (this.isauto) {
                    if ([1, 11155111].includes(chainId)) {
                        //erc
                        console.log(`erc link`)
                        await this.$store.dispatch(`setWalletIndex`, 0)
                    } else if ([56].includes(chainId)) {
                        //bsc
                        console.log(`bsc link`)
                        await this.$store.dispatch(`setWalletIndex`, 1)
                    }
                    await this.ethcontent_address();
                } else {
                    await this.ethcontent_address();
                }
            } catch (e) {
                console.log(`ethcontent_chain exception`, e)
                comjs.jsalert('连接失败');
            }
        },
        async trccontent() {
            if (window.tronWeb && typeof window.tronWeb?.defaultAddress?.base58 !== 'undefined') {
                await this.$store.dispatch(`setAddress`, window.tronWeb.defaultAddress.base58)
                await this.$store.dispatch(`setIsConnected`, true)
                await this.$store.dispatch(`setWalletIndex`, 2)
                this.tronWeb = window.tronWeb;
            } else {
                this.show_ethWallet_list()
            }
        },
        show_ethWallet_list() {
            //钱包跳转
            //@todo 域名从接口获取？
            let dappdomain = window.location.origin //本站域名
            //各个以太坊钱包地址
            let walletName = ['MetaMask', 'Coinbase', 'imToken', 'TokenPocket', 'TrustWallet']
            let walletUrl = {}
            walletUrl[0] = `https://metamask.app.link/dapp/${dappdomain}`
            walletUrl[1] = 'https://go.cb-w.com/'
            walletUrl[2] = `imtokenv2://navigate/DappView?url=${dappdomain}`
            walletUrl[3] = `tpdapp://open?params={"url": "${dappdomain}", "chain": "ETH"}`
            walletUrl[4] = `https://link.trustwallet.com/open_url?url=${dappdomain}`
            uni.showActionSheet({
                title: null,
                itemList: walletName,
                success: (res) => {
                    console.log('url', walletUrl[res.tapIndex])
                    window.location.href = walletUrl[res.tapIndex]
                }
            })
        },
    }
}