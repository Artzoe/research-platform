export interface MedicalImage {
  id: string
  url: string
  uploadTime: string
  tag?: string
  markdown: string
}

export type SectionKey = 'diagnosis' | 'neoadjuvant' | 'surgery' | 'adjuvant' | 'radiation' | 'recurrence' | 'salvage' | 'gene'

const _imageAssociations: Record<string, SectionKey> = {
  '1': 'diagnosis',
  '3': 'diagnosis',
}

export function getImageAssociations(): Record<string, SectionKey> {
  return { ..._imageAssociations }
}

export function associateImage(imageId: string, sectionKey: SectionKey) {
  _imageAssociations[imageId] = sectionKey
}

export function disassociateImage(imageId: string) {
  delete _imageAssociations[imageId]
}

export const mockImages: MedicalImage[] = [
  {
    id: '1',
    url: '/records/pathology.svg',
    uploadTime: '2022-07-12 12:12:12',
    markdown: `# 病理检查报告

**科室：** 病理科 &emsp; **日期：** 2022年7月12日

---

## 大体所见

左乳穿刺标本：灰白色穿刺组织2条，长约1.0-1.5cm，直径0.1cm，全部取材。

## 镜下所见

穿刺组织中见浸润性癌巢，癌细胞呈条索状、腺管状排列，间质纤维结缔组织增生伴慢性炎细胞浸润。

## 病理诊断

**（左乳穿刺）浸润性导管癌，Ⅱ级**

组织学分级：Nottingham评分 6分（腺管 2分 + 核分裂 2分 + 多形性 2分）

## 免疫组化

| 指标 | 结果 | 指标 | 结果 |
|------|------|------|------|
| ER | 3+（80%） | PR | 2+（45%） |
| HER-2 | 2+ | Ki-67 | 30% |
| FISH | 扩增（比值 2.3） | | |
| CK5/6 | (-) | P63 | (-) |

---

**报告医师：** 张明华 &emsp; **审核医师：** 李建国`,
  },
  {
    id: '2',
    url: '/records/ultrasound.svg',
    uploadTime: '2022-07-12 14:30:00',
    markdown: `# 乳腺超声检查报告

**科室：** 超声科 &emsp; **日期：** 2022年7月12日

**临床诊断：** 左乳肿物待查

---

## 超声所见

左乳外上象限探及一低回声肿块，大小约 **2.5 × 1.8 × 1.6cm**，形态不规则，边界不清，可见毛刺征，内部回声不均匀，后方回声轻度衰减。CDFI：内可见点条状血流信号。

左腋下探及数个淋巴结回声，较大者约 **1.2 × 0.8cm**，皮质增厚，皮髓质分界欠清。

右乳未见明确异常回声。

## 超声诊断

1. 左乳外上象限实性肿块 **BI-RADS 5类**（高度可疑恶性，建议穿刺活检）
2. 左腋窝淋巴结肿大，考虑转移可能

---

**报告医师：** 陈丽萍 &emsp; **审核医师：** 李建国`,
  },
  {
    id: '3',
    url: '/records/blood_test.svg',
    uploadTime: '2022-07-12 09:05:33',
    markdown: `# 检验报告单

**科室：** 检验科 &emsp; **日期：** 2022年7月12日

**标本类型：** 静脉血

---

## 血常规

| 项目 | 结果 | 参考值 |
|------|------|--------|
| WBC | 6.8×10⁹/L | 4.0-10.0 |
| RBC | 4.12×10¹²/L | 3.5-5.0 |
| HGB | 128 g/L | 110-150 |
| PLT | 245×10⁹/L | 100-300 |
| NEU% | 62.3% | 50-70 |

## 肝功能

| 项目 | 结果 | 参考值 |
|------|------|--------|
| ALT | 23 U/L | 0-40 |
| AST | 19 U/L | 0-40 |
| ALB | 42.5 g/L | 35-55 |

## 肿瘤标志物

| 项目 | 结果 | 参考值 |
|------|------|--------|
| CA153 | 12.6 U/mL | <25 |
| CEA | 2.3 ng/mL | <5 |
| CA125 | 18.4 U/mL | <35 |

---

**报告医师：** 赵伟 &emsp; **审核医师：** 李建国`,
  },
  {
    id: '4',
    url: '/records/admission.svg',
    uploadTime: '2022-07-11 16:20:00',
    markdown: `# 入院记录

**科室：** 乳腺外科 &emsp; **日期：** 2022年7月11日

---

## 主诉

发现左乳肿物2月余

## 现病史

患者2月前无意中发现左乳外上象限一肿物，约蚕豆大小，无疼痛，无乳头溢液，无皮肤凹陷，无发热。遂至我院门诊就诊，行乳腺超声检查提示左乳外上象限实性肿块（BI-RADS 5类），为进一步诊治收治入院。

## 既往史

既往体健，否认高血压、糖尿病、心脏病史。否认肝炎、结核等传染病史。否认外伤手术史。

## 家族史

母亲有乳腺癌病史，已故。余家族成员体健。

## 体格检查

- **T:** 36.5℃ &emsp; **P:** 78次/分 &emsp; **R:** 18次/分 &emsp; **BP:** 125/80mmHg
- 左乳外上象限可触及一肿块，约2.5×2.0cm，质硬，边界不清，活动度差，与皮肤无粘连
- 左腋下可触及肿大淋巴结
- 右乳未触及异常

---

**报告医师：** 王晓明 &emsp; **审核医师：** 李建国`,
  },
  {
    id: '5',
    url: '/records/surgery.svg',
    uploadTime: '2022-07-11 10:45:00',
    markdown: `# 手术记录

**科室：** 乳腺外科 &emsp; **手术日期：** 2022年7月11日

- **术前诊断：** 左乳浸润性导管癌 cT2N1M0
- **术后诊断：** 左乳浸润性导管癌 pT1cN1M0
- **手术名称：** 左乳保乳术 + 前哨淋巴结活检
- **麻醉方式：** 全身麻醉

---

## 手术经过

患者取仰卧位，常规消毒铺巾。全麻成功后，于左乳肿块表面做弧形切口，逐层切开皮肤、皮下组织，以肿块为中心距边缘2cm切除肿块及周围正常组织。术中快速冰冻示：**切缘阴性**。

注射示踪剂后行前哨淋巴结活检，检出前哨淋巴结3枚，术中冰冻示1枚阳性，遂行腋窝淋巴结清扫。清扫I-II组淋巴结，共检出淋巴结18枚。

彻底止血，留置引流管，逐层缝合切口。

## 术中出血

约50ml，未输血。

---

**报告医师：** 王晓明 &emsp; **审核医师：** 李建国`,
  },
  {
    id: '6',
    url: '/records/ct_report.svg',
    uploadTime: '2022-07-11 08:12:00',
    markdown: `# CT检查报告

**科室：** 影像科 &emsp; **日期：** 2022年7月11日

**检查部位：** 胸部CT平扫+增强

---

## CT所见

左乳外上象限见一不规则高密度影，大小约 **2.3 × 1.7cm**，增强扫描明显强化，边缘毛糙，可见毛刺征。

左腋窝见数个增大淋巴结，较大者短径约0.9cm，增强后均匀强化。

双肺野未见明确异常高密度影。纵隔内未见肿大淋巴结。心脏大小形态正常。

胸椎骨质未见明确破坏征象。

## CT诊断

1. 左乳占位性病变，结合病史考虑乳腺癌
2. 左腋窝淋巴结肿大，考虑转移
3. 双肺未见明确转移灶

---

**报告医师：** 刘建平 &emsp; **审核医师：** 李建国`,
  },
  {
    id: '7',
    url: '/records/discharge.svg',
    uploadTime: '2022-07-10 15:30:00',
    markdown: `# 出院小结

**科室：** 乳腺外科

- **入院日期：** 2022年7月11日
- **出院日期：** 2022年7月10日

---

## 入院诊断

左乳浸润性导管癌 cT2N1M0 IIB期

## 出院诊断

左乳浸润性导管癌 pT1cN1M0 IIA期
ER(+) PR(+) HER2(2+/FISH扩增) Ki-67 30%

## 治疗经过

入院后完善各项检查，排除手术禁忌后于7月11日在全麻下行左乳保乳术+前哨淋巴结活检+腋窝淋巴结清扫术。术后病理示浸润性导管癌，切缘阴性，前哨淋巴结1/3(+)，腋窝淋巴结1/15(+)。术后恢复良好，切口愈合佳。

## 出院医嘱

1. 术后2周门诊拆线
2. 拔除引流管后开始功能锻炼
3. 术后4周开始辅助化疗（AC-TH方案）
4. 定期复查：每3个月一次

---

**报告医师：** 王晓明 &emsp; **审核医师：** 李建国`,
  },
  {
    id: '8',
    url: '/records/ihc_report.svg',
    uploadTime: '2022-07-10 11:00:00',
    markdown: `# 免疫组化报告

**科室：** 病理科 &emsp; **日期：** 2022年7月10日

**标本来源：** 左乳保乳术后标本

---

## 免疫组化结果

| 指标 | 结果 | 判定 |
|------|------|------|
| ER | (+++) 80% | 阳性 |
| PR | (++) 45% | 阳性 |
| HER-2 | (++) 2+ | 不确定 |
| Ki-67 | 30% | — |
| P53 | 突变型（~70%） | — |
| CK5/6 | (-) | — |
| EGFR | (-) | — |
| AR | (+) 40% | — |
| P63 | (-) | — |

## FISH检测

| 项目 | 结果 |
|------|------|
| HER2基因 | **扩增** |
| HER2/CEP17 | 比值 2.3 |
| HER2拷贝数 | 平均 8.6 个/细胞 |
| CEP17拷贝数 | 平均 3.7 个/细胞 |

## 分子分型

**Luminal B型（HER2阳性）**

建议行抗HER2靶向治疗联合化疗

---

**报告医师：** 张明华 &emsp; **审核医师：** 李建国`,
  },
  {
    id: '9',
    url: '/records/gene_test.svg',
    uploadTime: '2022-07-10 09:30:00',
    markdown: `# 基因检测报告

**科室：** 分子病理中心 &emsp; **日期：** 2022年7月10日

- **标本类型：** FFPE组织
- **检测方法：** NGS高通量测序

---

## BRCA1/2基因检测

| 基因 | 变异 | 判定 |
|------|------|------|
| BRCA1 | c.5266dupC (p.Q1756Pfs*74) | **致病性突变** |
| BRCA2 | 未检出致病性变异 | — |

## 其他基因变异

| 基因 | 变异 | 频率 |
|------|------|------|
| PIK3CA | p.H1047R | 32% |
| TP53 | p.R248W | 45% |
| PTEN | 未检出 | — |
| CDH1 | 未检出 | — |

## 用药建议

1. BRCA1致病突变阳性，可考虑 **PARP抑制剂** 治疗（奥拉帕利）
2. PIK3CA突变阳性，可考虑PI3K抑制剂
3. 建议家族成员进行遗传咨询及基因检测

## 微卫星稳定性

- **MSI状态：** MSS（微卫星稳定）
- **TMB：** 4.2 Muts/Mb（低）

---

**报告医师：** 周建国 &emsp; **审核医师：** 李建国`,
  },
]

export const allImagesSorted = [...mockImages].sort((a, b) => b.uploadTime.localeCompare(a.uploadTime))

export function groupByDate(images: MedicalImage[]): { date: string; images: MedicalImage[] }[] {
  const map = new Map<string, MedicalImage[]>()
  for (const img of images) {
    const dateKey = img.uploadTime.slice(0, 10)
    if (!map.has(dateKey)) map.set(dateKey, [])
    map.get(dateKey)!.push(img)
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, imgs]) => ({ date, images: imgs }))
}
