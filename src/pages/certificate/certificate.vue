<template>
	<view>
		<view class="tabs">
			<button type="default" @click="showIndex = 0"
				:class="['btn', {active: showIndex === 0}]">{{$t('certificate.title')}}</button>
			<button type="default" @click="showIndex = 1"
				:class="['btn', {active: showIndex === 1}]">{{$t('certificate')}}</button>
		</view>
		<view class="msb content" v-show="showIndex === 0">
			<view class="title">
				MSB Licence
			</view>
			<view class="paragraph">
				The core members of Ethernet are from top Internet and financial companies. The platform has a professional
				financial-grade transaction structure and a self-developed high-concurrency memory matching transaction engine.
        Ethernet Community Co., Ltd. has obtained the MSB compliance operation license in the United States and Canada.
			</view>
			<view class="sub-title">US MSB license</view>
			<image class="img" src="../../static/img/certificate/msb_1.jpg" style="height: calc((100vw - 20px)*1280/960);"
				mode="aspectFit"></image>
			<view class="paragraph">
				The MSB (MoneyServiceBusiness) license is a financial license regulated by the U.S. Treasury Department and
				issued by the U.S. Treasury Department. It mainly regulates money service-related businesses and companies,
				including digital currency, virtual currency transactions, and international payment companies. Companies
				engaged in the above-mentioned related businesses in the United States must apply for an MSB license to operate
				legally.
			</view>
			<view class="sub-title">
				Canadian MSB license
			</view>
			<image class="img" src="../../static/img/certificate/msb_2.jpg" mode="aspectFit"></image>
			<view class="paragraph">
				FINTRAC Canada, full name FTR Canada or MSB Canada, is a Canadian financial regulator established in 2000 to
				collect, analyze, evaluate and disclose information about Canada's financial sector to protect Canada's
				financial stability and security. FINTRAC is responsible for collecting, analyzing, evaluating and disclosing
				information related to Canada's financial industry to protect Canada's financial stability and security.
			</view>w
			<view class="sub-title">
				US stock license
			</view>
			<image class="img" src="../../static/img/certificate/msb_3.jpg" mode="aspectFit"></image>
			<view class="sub-title">Canadian stock license</view>
			<image class="img" src="../../static/img/certificate/msb_4.jpg" mode="aspectFit"></image>
			<view class="paragraph">The platform has successfully obtained dual stock licenses in the United States and
				Canada. Ethernet Community always regards operational compliance, fast transaction, privacy and security as an
				important strategic direction for corporate development. The successful acquisition of dual-stock financial
				licenses in the United States and Canada has become an important milestone in the standardized operation and
				globalization of Ethernet Community.</view>
			<view class="paragraph">Ethernet Community always adheres to the user first, and is committed to providing global users
				with the most efficient, safe and high privacy asset management and trading services. In the future, 088
				Exchange will continue to implement the global strategic layout and adhere to compliant operation and
				development.</view>
		</view>
		<view class="certificate content" v-show="showIndex === 1">
			<view class="title">certificate</view>
			<view class="sub-title">Compliance operation, safety and efficiency</view>
			<view class="paragraph">Ethernet Community: Ethernet Community Co., Ltd., the company operates the website: www.088vip.cc and
				related mobile applications (hereinafter referred to as "platform"), and based on this platform provides users
				with financial transactions between digital currencies and related Serve.</view>
			<view class="sub-title">American company certificate</view>
			<image class="img" src="../../static/img/certificate/msb1.jpg" style="height: calc((100vw - 20px)*1280/989);"
				mode="aspectFit"></image>
			<view class="sub-title">Company Name: Ethernet Community Co., Ltd.</view>
			<view class="sub-title">Company Address: 1391 Speer Blvd #266, DENVER, CO 80204, United States</view>
			<image class="img" src="../../static/img/certificate/msb2.jpg" mode="aspectFit"></image>
			<view class="paragraph">
				US company certificate official website query address:
				<view class="link" @click="open">
					https://www.coloradosos.gov/biz/BusinessEntityDetail.do?quitButtonDestination=BusinessEntityResults&nameTyp=ENT&masterFileId=20221447791&entityId2=20221447791&fileId=20221447791&srchTyp=ENTITY
				</view>
			</view>
			<view class="sub-title">
				Canadian company certificate
			</view>
			<image class="img" src="../../static/img/certificate/msb3.jpg" style="height: calc((100vw - 20px)*1280/989);"
				mode="aspectFit"></image>
			<view class="sub-title">Company Name: Ethernet Community Co., Ltd.</view>
			<view class="sub-title">Company address: 350 BAY STREET, 11th FLOOR, Toronto ON FRANCHINA M5H 2S6, Canada</view>
			<image class="img" src="../../static/img/certificate/msb4.jpg" style="height: calc((100vw - 20px)*1280/544);"
				mode="aspectFit"></image>
			<view class="paragraph">
				Canadian company certificate official website query address:
				<text class="link" @click="openWebsite">
					https://www.ic.gc.ca/app/scr/cc/CorporationsCanada/fdrlCrpDtls.html?corpId=13999025&V_TOKEN=null&crpNm=088&crpNmbr=&bsNmbr=
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showIndex: 0
			};
		},
		methods: {
			open() {
				window.location.href =
					'https://www.coloradosos.gov/biz/BusinessEntityDetail.do?quitButtonDestination=BusinessEntityResults&nameTyp=ENT&masterFileId=20221447791&entityId2=20221447791&fileId=20221447791&srchTyp=ENTITY'
			},
			openWebsite() {
				window.location.href =
					'https://www.ic.gc.ca/app/scr/cc/CorporationsCanada/fdrlCrpDtls.html?corpId=13999025&V_TOKEN=null&crpNm=088&crpNmbr=&bsNmbr='
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabs {
		display: flex;
		padding: 10px 20px;

		.btn {
			width: 44%;
			height: 39px;
			border-radius: 5px;
			box-shadow: 0 1px 2px #4a4a4a;
			line-height: 35px;
			font-weight: 700;
			letter-spacing: 1px;
			box-sizing: border-box;
			background-color: white;
			font-size: 24rpx;

			&.active {
				border-bottom: 3px solid #0052ff;
			}
		}
	}

	.title {
		margin: 24rpx 0;
		font-size: 24rpx;
		text-align: center;
	}

	.content {
		padding: 10px;
		color: #333333;
		font-size: 24rpx;
	}

	.paragraph {
		margin: 24rpx 0;
	}

	.sub-title {
		margin: 24rpx 0;
	}

	.img {
		width: 100%;
	}

	.link {
		color: #0000ee;
		word-break: break-all;
	}
</style>
