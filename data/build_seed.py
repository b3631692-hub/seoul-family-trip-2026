import json, pathlib
root=pathlib.Path(__file__).parent
P={
'icn':('仁川國際機場','Incheon International Airport, Incheon, Republic of Korea',37.4602,126.4407),
'dongdaemun':('東大門／興仁之門','Heunginjimun Gate, Jongno-gu, Seoul, Republic of Korea',37.5711,127.0095),
'hotel':('LEEJAE Hotel','LEEJAE Hotel, Dongdaemun, Seoul, Republic of Korea',None,None),
'myeongdong':('明洞','Myeong-dong, Jung-gu, Seoul, Republic of Korea',37.5636,126.9834),
'gyeongbok':('景福宮','Gyeongbokgung Palace, Jongno-gu, Seoul, Republic of Korea',37.5796,126.9770),
'bukchon':('北村韓屋村','Bukchon Hanok Village, Jongno-gu, Seoul, Republic of Korea',37.5824,126.9835),
'insadong':('仁寺洞／益善洞','Insadong, Jongno-gu, Seoul, Republic of Korea',37.5730,126.9860),
'gwangjang':('廣藏市場','Gwangjang Market, Jongno-gu, Seoul, Republic of Korea',37.5700,126.9996),
'seoulplaza':('首爾廣場','Seoul Plaza, Jung-gu, Seoul, Republic of Korea',37.5657,126.9780),
'lantern':('清溪川燈節','Cheonggye Plaza, Jongno-gu, Seoul, Republic of Korea',37.5692,126.9774),
'eobi':('魚飛冰谷','Eobi Ice Valley, Gapyeong-gun, Gyeonggi-do, Republic of Korea',None,None),
'nami':('南怡島','Nami Island, Chuncheon-si, Gangwon-do, Republic of Korea',37.7903,127.5250),
'rail':('江村鐵道自行車','Gangchon Rail Park, Gimyujeong Station, Chuncheon-si, Gangwon-do, Republic of Korea',37.8185,127.7192),
'ddp':('東大門設計廣場','Dongdaemun Design Plaza, Jung-gu, Seoul, Republic of Korea',37.5670,127.0095),
'gangnam':('新論峴／醫美診所','Sinnonhyeon Station, Gangnam-gu, Seoul, Republic of Korea',37.5046,127.0255),
'coex':('COEX Mall','Starfield COEX Mall, Gangnam-gu, Seoul, Republic of Korea',37.5115,127.0594),
'lotte':('樂天世界塔','Lotte World Tower, Songpa-gu, Seoul, Republic of Korea',37.5126,127.1025),
'cheongnyangni':('清涼里 Lotte Mart','Lotte Mart Cheongnyangni, Dongdaemun-gu, Seoul, Republic of Korea',37.5805,127.0470)
}
DOC='來源：2026首爾五天四夜.docx；未查證事項另標記。'
E=[]
def event(id,day,start,duration,category,name,place,notes='',group='all',visual=None,priority=0,locked=False,booking='unverified',sourceUrl='',cost=None,transportMode=None):
    pname,address,lat,lng=P[place]
    E.append(dict(id=id,date='2026-12-'+str(day),start=start,durationMinutes=duration,category=category,title=name,placeName=pname,address=address,locationId=place,lat=lat,lng=lng,notes=notes,group=group,visualKey=visual,visualPriority=priority,locked=locked,bookingStatus=booking,sourceUrl=sourceUrl,cost=cost or {'currency':'KRW','items':[],'status':'unknown'}, transportMode=transportMode))
fee_bus={'currency':'KRW','items':[{'id':'adult','label':'成人票','unit':'perPerson','unitPrice':17000,'quantity':7},{'id':'child','label':'6–12 歲兒童票','unit':'perPerson','unitPrice':12000,'quantity':2}], 'status':'estimated','note':'官方公布成人／兒童票價；合計依 7 大 2 小推算，2.5 歲幼童是否佔座／收費請確認。'}
fee_palace={'currency':'KRW','items':[{'id':'adult','label':'一般成人票（穿韓服可能免票）','unit':'perPerson','unitPrice':3000,'quantity':7}], 'status':'estimated','note':'官方成人票價為 ₩3,000；團票、韓服免票與高齡優惠未確認，這是一般票情境試算。'}
fee_rail={'currency':'KRW','items':[{'id':'four','label':'4 人座車','unit':'perCar','unitPrice':56000,'quantity':2},{'id':'two','label':'2 人座車','unit':'perCar','unitPrice':40000,'quantity':1}],'status':'scenario','note':'原手冊配置的價格試算，車型混用與幼兒資格有官方資訊衝突，尚不可當作可訂方案。'}
# Day 1
event('d1-arrival','16','16:00',60,'flight','抵達仁川機場・通關領行李','icn','原手冊抵達 16:00，未附航班編號或訂位確認。幼童與長輩分工通關；通關時間僅暫排。',visual='plane',priority=115)
event('d1-bus','16','17:00',75,'transport','機場巴士 6002 → 東大門','dongdaemun','仁川 T1／T2 上車點與售票方式依航廈確認；T2 需先購票。手冊預估 75 分鐘，不保證車程。',sourceUrl='https://airportlimousine.co.kr/en/sub/sub01.php?cat_no=6',cost=fee_bus,transportMode='bus')
event('d1-hotel','16','18:15',30,'lodging','LEEJAE 飯店 Check-in','hotel','東大門住宿基地。精確地址、房型與預訂編號尚未提供。',visual='hotel',priority=50)
event('d1-exchange','16','18:45',45,'spot','明洞換匯・先辦現金','myeongdong','原手冊 18:45–21:00 為換匯＋Olive Young；為方便編輯拆分時段，45 分鐘是規劃假設，換錢所營業時間待確認。')
event('d1-dinner','16','19:30',60,'food','明洞晚餐（三選一）','myeongdong','荒謬的生肉／明洞亭／本粥／明洞餃子，視孩童體力決定。時間為從手冊整段拆分的假設。')
event('d1-shopping','16','20:30',30,'spot','Olive Young 採買','myeongdong','實際分店營業時間待查，疲累時可取消。')
event('d1-return','16','21:30',30,'transport','返回東大門飯店','hotel','原手冊記載包車返回，車資與預約均未提供。',transportMode='taxi')
# day2
event('d2-breakfast','17','07:45',45,'food','東大門 Isaac Toast 早餐','dongdaemun','可派 1–2 位大人外帶回飯店，避免全團久候。')
event('d2-palace','17','08:30',180,'spot','景福宮・韓服體驗','gyeongbok','原手冊 08:30–11:30 包含轉乘與景點體驗；官方 12 月開門 09:00，需保留移動時間。從東大門轉乘 1、3 號線的路線與電梯位置待複核。',visual='palace',priority=120,sourceUrl='https://royal.khs.go.kr/ENG/contents/E702000000.do',cost=fee_palace)
event('d2-bukchon','17','11:30',45,'spot','北村韓屋村・輕鬆散步','bukchon','長輩與推車以外圍平坦路段為主，坡路可跳過。')
event('d2-lunch','17','12:30',90,'food','益善洞／仁寺洞午餐','insadong','昌華堂或智異山二選一；飯後可留咖啡休息時間。')
event('d2-market','17','14:30',120,'spot','廣藏市場・棉被與小吃','gwangjang','棉被店 88、128 號（未查證），綠豆煎餅、麻藥飯捲、魚板湯。')
event('d2-square','17','17:00',60,'spot','首爾廣場・市政廳前聖誕布置','seoulplaza','原手冊 17:00–18:30 是首爾廣場＋燈節的合併時段；這裡拆成 17:00–18:00。',visual='lights',priority=60)
event('d2-festival','17','18:00',30,'spot','清溪川首爾燈節','lantern','官方公告 2026/12/11–2027/01/31、每日 18:00–23:00、免費。擁擠時照顧推車與幼兒。',visual='lights',priority=110,sourceUrl='https://english.visitseoul.net/eventsx/2026SeoulLanternFestival/ENPi0rhml',cost={'currency':'KRW','items':[{'id':'free','label':'免費入場','unit':'perGroup','unitPrice':0,'quantity':1}],'status':'verified'})
event('d2-dinner','17','19:00',90,'food','東大門晚餐・一隻雞','dongdaemun','陳玉華一隻雞或孔陵一隻雞；順買隔日早餐麵包。')
# day3
event('d3-breakfast','18','07:00',30,'food','飯店吃麵包・包車集合','hotel','原手冊 07:30 準時包車出發，包車預訂尚未提供。')
event('d3-eobi','18','09:00',60,'spot','魚飛冰谷・冬季冰瀑','eobi','冰面濕滑，請確認開放狀況及帶防滑鞋。包車移動時間依手冊約 07:30–09:00，尚未由路況驗證。',visual='snow',priority=80)
event('d3-nami','18','10:30',180,'spot','南怡島散步＋島上午餐','nami','含登島船票與島內用餐，餐廳候選「戀歌之家」或春川辣炒雞；天氣影響可行性。',visual='pine',priority=92)
event('d3-rail','18','14:30',120,'spot','江村鐵道自行車','rail','【重要】原手冊計畫 4 人座×2＋2 人座×1、2.5 歲幼童抱乘。業者官方頁面對幼兒與混用車型資訊不一致，務必確認能否登車、是否要改分組、冬季班次及預約。官方建議至少提前 20 分鐘報到。',visual='bike',priority=125,sourceUrl='https://en.railpark.co.kr/reserve/guide',cost=fee_rail)
event('d3-dinner','18','18:30',120,'food','東大門晚餐＋自由逛街','ddp','滿足五香豬腳或橋村炸雞；可逛 DDP 或 Outlet。')
event('d3-spa','18','21:00',90,'spot','SPAREX 汗蒸幕（自由參加）','ddp','選擇性活動；幼童與分組照護依場館規範確認。',group='optional')
# day4
event('d4-breakfast','19','08:15',60,'food','東大門早餐（粥／飯捲）','dongdaemun','本粥或紫菜包飯天國。')
event('d4-busA','19','09:30',30,'transport','A 組：前往新論峴','gangnam','原手冊建議 140／420 號巴士，車程與停靠站需複核。',group='A',transportMode='bus')
event('d4-busB','19','09:30',30,'transport','B 組：前往 COEX','coex','原手冊建議 301／144 號公車，車程與停靠站需複核。',group='B',transportMode='bus')
event('d4-clinic','19','10:00',150,'spot','A 組：林克醫美・諮詢／療程','gangnam','尚無診所確切地址或預約資料；確認後才鎖定。',group='A',visual='building',priority=55)
event('d4-aquarium','19','10:00',150,'spot','B 組：COEX 水族館','coex','長輩與三位小孩的室內行程；年齡票價與營業時間待核。',group='B',visual='fish',priority=85)
event('d4-lunch','19','12:30',90,'food','A／B 兩組 COEX 會合午餐','coex','商場餐廳或美食街，預留兒童餐椅需求。')
event('d4-shopping','19','14:00',120,'spot','COEX／現代百貨超市採買','coex','採買伴手禮與休息。')
event('d4-sky','19','16:30',120,'spot','Seoul Sky 高空觀景台','lotte','原手冊「Seoul Sky 或首爾塔」二選一，這裡暫以 Seoul Sky 為主方案；票價及日落時段待核。',visual='tower',priority=125)
event('d4-dinner','19','19:00',120,'food','東大門晚餐＋最後補貨','dongdaemun','八色烤肉或新村食堂；清涼里 Lotte Mart 是可選額外採買，商場營業時間待確認。')
# day5
event('d5-brunch','20','08:30',120,'food','東大門早午餐＋行李整理','dongdaemun','元堂脊骨土豆湯或神仙雪濃湯；預留整理戰利品時間。')
event('d5-airport-transfer','20','10:45',90,'transport','退房・前往仁川機場','icn','【手冊衝突】總覽寫機場巴士 6002；Day5 詳細寫「兩台包車」。此處先依詳細行程排包車，但車型、費用與是否預訂尚需確認。',transportMode='taxi')
event('d5-checkin','20','12:15',150,'flight','仁川機場報到・退稅・安檢','icn','行李與退稅、幼兒 Fast Track 資格依航司與機場當日規範確認；此行程非航班訂位證明。',visual='plane',priority=50)
event('d5-depart','20','15:00',90,'flight','預計起飛・返回台灣','icn','原手冊記載 15:00 起飛，未提供航班編號／機場航廈／登機時間；時長 90 分鐘是網站顯示用暫排，非航程。',visual='plane',priority=150)
R={
'd3-breakfast=>d3-eobi':{'mode':'charter','minutes':90,'status':'estimated','notes':'依手冊 07:30 出發／09:00 抵達反推；實際車程待查。'},
'd3-eobi=>d3-nami':{'mode':'charter','minutes':30,'status':'estimated','notes':'依手冊 10:00→10:30 的空檔暫排。'},
'd3-nami=>d3-rail':{'mode':'charter','minutes':60,'status':'estimated','notes':'依手冊 13:30→14:30 空檔反推；另需 20 分鐘報到緩衝。'},
'd4-shopping=>d4-sky':{'mode':'subway','minutes':30,'status':'estimated','notes':'估算值，未核班次／進站步行。'},
'd1-shopping=>d1-return':{'mode':'taxi','minutes':30,'status':'estimated','notes':'依手冊 21:00–21:30 空檔推估。'},
}
packing_groups=[
('證件與金融','護照正本',10,'檢查有效期限及實際入境規定'),('證件與金融','機票與飯店確認單',1,'確認航班編號、航廈與 LEEJAE 詳細地址'),('證件與金融','旅平／不便險資料',10,'含海外醫療與緊急聯絡資訊'),('證件與金融','信用卡及備用韓幣',1,'確認海外刷卡功能'),('證件與金融','e-Arrival Card',10,'需在入境前 3 天內依適用身分完成；團體可使用官方網站'),('證件與金融','包車與門票預約單',1,'郊區包車／江村鐵道自行車／觀景台'),
('通訊與 3C','韓國 eSIM／SIM 卡',7,'出發前先完成 App 驗證'),('通訊與 3C','充電器與長充電線',4,'支援多孔快充、線長 1.5–2 米'),('通訊與 3C','行動電源',4,'標示 Wh，禁止託運；依航司規範'),('通訊與 3C','韓規 C/F 轉接頭',4,'韓國圓形插座'),('通訊與 3C','退卡針與小夾鏈袋',2,'有實體 SIM 者'),('通訊與 3C','交通卡 T-money',9,'成人 7 張＋大童 2 張，兒童身分設定待確認'),
('冬季保暖','羽絨外套／保暖衣物',10,'洋蔥式穿法'),('冬季保暖','毛帽與圍巾',10,'帽子遮耳'),('冬季保暖','防風手套',10,'Day3 戶外活動'),('冬季保暖','防滑鞋',10,'冰谷／北村坡路'),('冬季保暖','暖暖包',50,'以每天每人一份暫列，依需求增減'),('冬季保暖','護唇膏與保濕乳液',10,'乾燥室內暖氣環境'),
('親子用品','輕便推車＋防風雨罩',1,'2.5 歲幼童'),('親子用品','尿布＋濕紙巾',1,'備足五日'),('親子用品','保溫水壺與餐具',3,'視年齡需求'),('親子用品','零食／安撫玩具',1,'長途包車與候位備用'),('親子用品','兒童牙刷牙膏',3,'熟悉款式'),
('醫療與安全','常備藥／處方藥',1,'醫囑用藥、退燒、腸胃、暈車'),('醫療與安全','OK 繃與人工皮',1,'保暖與防滑應急'),('醫療與安全','保險救援電話備份',1,'離線儲存'),
('購物與其他','折疊購物袋',10,'每人一個'),('購物與其他','衣物壓縮袋／夾鏈袋',5,'冬季衣物占空間'),('購物與其他','行李秤',1,'回程購物裝箱'),('購物與其他','成人牙刷牙膏',7,'確認住宿供應情況'),('購物與其他','室內拖鞋與替換襪子',10,'依需求準備')
]
packing=[dict(id='pack-'+str(i+1).zfill(3),category=c,title=t,quantity=q,notes=n,checked=False) for i,(c,t,q,n) in enumerate(packing_groups)]
checks=[
{'id':'check-rail','level':'critical','title':'江村鐵道自行車：2.5 歲幼童與混合車型','detail':'英文訂位說明禁止 36 個月以下幼兒、2+4 人座同時段混用；韓文 FAQ 允許幼兒具文件簽切結的例外。須先向業者確認再付款，並先驗證 14:30 場次及預留至少 20 分鐘報到。','source':'https://en.railpark.co.kr/reserve/guide','status':'pending'},
{'id':'check-lasttransport','level':'critical','title':'Day 5 交通方式互相矛盾','detail':'原手冊總覽寫機場巴士 6002，詳細時間表寫兩台包車，暫採詳細時間表。需確認實際方式、上車處、價格與 10 人／行李容量。','source':'','status':'pending'},
{'id':'check-flights','level':'critical','title':'往返航班、機場航廈與預訂憑證','detail':'原手冊只列 12/16 16:00 抵達、12/20 15:00 起飛，未附航班與航廈；應核對入境通關、巴士銜接、退稅緩衝。','source':'','status':'pending'},
{'id':'check-hotel','level':'critical','title':'LEEJAE 飯店確切地址與訂房憑證','detail':'僅有名稱與東大門位置，未附可定位地址；地圖顯示鄰近東大門站而不是飯店精確位置。','source':'','status':'pending'},
{'id':'check-railseason','level':'warning','title':'鐵道自行車冬季營運及訂位時段','detail':'應確認 12/18 14:30 班次、座位數、天候停駛政策。','source':'https://en.railpark.co.kr/course/gimyujeong/schedule','status':'pending'},
{'id':'check-bus','level':'warning','title':'機場巴士 6002 上車點／購票','detail':'官方顯示成人 ₩17,000、6–12 歲 ₩12,000；仁川 T2 現場先購票，T1 依現場站牌及時刻核對。','source':'https://airportlimousine.co.kr/en/sub/sub01.php?cat_no=6','status':'partly_verified'},
{'id':'check-palace','level':'info','title':'景福宮 12 月營業時間','detail':'官方 11–12 月 09:00–17:00、16:00 最後入場，週二休；12/17 為週四，請注意 08:30 先用於交通。','source':'https://royal.khs.go.kr/ENG/contents/E702000000.do','status':'verified'},
{'id':'check-lantern','level':'info','title':'12/17 清溪川燈節活動時間','detail':'2026/12/11–2027/01/31，每晚 18:00–23:00，免費；已將 17:00 先安排首爾廣場，18:00 轉入燈節。','source':'https://english.visitseoul.net/eventsx/2026SeoulLanternFestival/ENPi0rhml','status':'verified'},
{'id':'check-entry','level':'warning','title':'韓國電子入境卡與簽證規定','detail':'官方 e-Arrival Card 免費、抵達前 3 日內申請；依 10 位旅客身分核對誰需填報。手機一次最多 9 人，建議分批或電腦團體申請。','source':'https://www.e-arrivalcard.go.kr/portal/guide/eacGuide.do?locale=E','status':'pending'},
{'id':'check-prices','level':'warning','title':'韓服、COEX 水族館、Seoul Sky、包車費用','detail':'原手冊未提供具體金額；網站保留空值，不自行當成免費。','source':'','status':'pending'},
{'id':'check-routing','level':'warning','title':'所有未註明的交通路段','detail':'沒有官方路由 API 的路段僅顯示位置示意或待估；已註明車程也是原手冊推估，不保證。','source':'','status':'pending'},
]
seed={'schemaVersion':1,'id':'seoul-family-2026','name':'2026 首爾冬日暖心家族旅行','destination':'首爾・京畿道・江原道','country':'韓國','startDate':'2026-12-16','endDate':'2026-12-20','timezone':'Asia/Seoul','currency':'KRW','settlementCurrency':'TWD','exchangeRates':{'KRW_TWD':None},'travellers':{'adults':7,'children':[2.5,8,10]},'lodging':'LEEJAE Hotel・東大門','dayHours':{'start':'07:00','end':'22:00'},'events':E,'routeOverrides':R,'packing':packing,'checks':checks,'updatedAt':'2026-11-19','provenance':DOC}
(root/'seoul2026.json').write_text(json.dumps(seed,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(len(E),'events',len(packing),'packing items',len(checks),'checks', (root/'seoul2026.json').stat().st_size)
