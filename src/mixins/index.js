import Web3 from "web3";
import {mapGetters} from "vuex";

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
    async onLoad() {
        await this.ethcontent()
    },
    methods: {
        async ethcontent_address() {
            console.log(`call ethcontent_address`)
            // 钱包地址
            const accounts = await this.web3js.eth.getAccounts();
            if (accounts.length >= 1 && accounts[0]) {
                await this.$store.dispatch(`setAddress`, accounts[0])
                await this.$store.dispatch(`setIsConnected`, true)
            }
        },
        async ethcontent() {
            console.log(`call ethcontent`)
            //检测是否以太环境
            const obj = setInterval(async () => {
                if (window.ethereum) {
                    console.log(`window.ethereum`)
                    clearInterval(obj);
                    if (typeof web3 !== 'undefined') {
                        console.log(`web3 !== undefined`)
                        this.web3js = new Web3(web3.currentProvider);
                    } else {
                        console.log(`web3 === undefined`)
                        this.web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
                    }
                    //@todo 这一步可能需要调整，在选择不同的链才触发
                    //链接钱包
                    await ethereum.request({method: 'eth_requestAccounts'});
                    await this.ethcontent_chain()
                } else if (window.tronWeb) {
                    console.log(`window.tronWeb`)
                    if (window.tronWeb.defaultAddress.base58) {
                        clearInterval(obj);
                        await this.$store.dispatch(`setAddress`, window.tronWeb.defaultAddress.base58)
                        await this.$store.dispatch(`setIsConnected`, true)
                        this.chainId = 2;
                        this.mychainId = 1;
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
            console.log(`commonMixin chooselink address`, this.$store.state.address)
            //选择链
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
                        await this.ethcontent()
                    }
                }
            })
        },
        async ethcontent_chain() {
            //获取链id
            console.log(`call ethcontent_chain`)
            try {
                const echainId = await ethereum.request({
                    method: 'eth_chainId'
                });
                this.mychainId = Web3.utils.hexToNumber(echainId)
                if (this.isauto) {
                    if (this.mychainId === 1) {
                        //erc
                        this.chainId = 0;
                    } else if (this.mychainId === 56) {
                        //bsc
                        this.chainId = 1;
                    }
                    await this.ethcontent_address();
                } else {
                    // 使用测试网的情况下，下面判断导致一直无法获取地址
                    // if (that.mychainId == that.walletlinkid[that.chainId]) {
                    await this.ethcontent_address();
                    // } else if (!that.isauto) {
                    // 	comjs.jsalert('请切换链到: ' + that.walletlinkName[that.chainId]);
                    // }
                }
            } catch (e) {
                comjs.jsalert('连接失败');
            }
        },
        async trccontent() {
            if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
                await this.$store.dispatch(`setAddress`, window.tronWeb.defaultAddress.base58)
                await this.$store.dispatch(`setIsConnected`, true)
                this.chainId = 2;
                this.mychainId = 1;
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