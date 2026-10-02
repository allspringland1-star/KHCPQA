type LocationText = {
  name: string;
  station: string;
  roadAddress: string;
  lotAddress: string;
  parking: string;
  subway: string[];
};

const locations: Record<string, LocationText> = {
  seoul: {
    name: "首尔总部", station: "钟路三街站",
    roadAddress: "首尔特别市钟路区水标路120号 Naein 大厦8层",
    lotAddress: "首尔特别市钟路区乐园洞141号 Naein 大厦8层",
    parking: "可使用一层免费停车场或周边收费停车场",
    subway: ["从1号线1号出口直行约3分钟，在大韩助听器店向右再直行约1分钟", "从3号线3号出口直行，再朝5号出口方向直行约1分钟", "从5号线5号出口朝罗州牛骨汤、钟路章鱼店方向直行约1分钟"]
  },
  gangnam: {
    name: "江南 SMC Academy", station: "九老数码园区站",
    roadAddress: "首尔特别市冠岳区始兴大路558-1号 G Valley Mind 5层505室",
    lotAddress: "首尔特别市冠岳区新林洞1655-17号 G Valley Mind 5层505室",
    parking: "大楼停车场",
    subway: ["从2号线6号出口直行约3分钟", "过人行横道后，前往 G Valley Mind 一期5层505室"]
  },
  daerim: {
    name: "大林校区", station: "大林站",
    roadAddress: "首尔特别市永登浦区大林路23街30-1号 Golden Tower 6层",
    lotAddress: "首尔特别市永登浦区大林洞1049号 Golden Tower 6层",
    parking: "大楼停车场",
    subway: ["从2号线、7号线12号出口出来后立即向左走", "位于左侧第二栋建筑后方", "从12号出口进入化妆品店旁的小巷，在88职业介绍所与高丽红参店后方"]
  }
};

function translateTransit(text: string) {
  const terms: Record<string, string> = {
    "구로디지털단지우체국": "九老数码园区邮局", "구로디지털단지입구": "九老数码园区入口",
    "구로디지털단지역": "九老数码园区站", "대동초등학교": "大同小学", "종로3가": "钟路三街",
    "대림역": "大林站", "7호선": "7号线", "공항": "机场", "일반": "普通", "간선": "干线",
    "지선": "支线", "직행": "直达", "마을": "社区巴士", "경기": "京畿", "심야": "夜间",
    "종로": "钟路", "구로": "九老", "영등포": "永登浦", "금천": "衿川"
  };
  return Object.entries(terms).reduce((value, [from, to]) => value.split(from).join(to), text);
}

export function localizeChineseLocation<T extends LocationText & {
  id: string;
  busStops: Array<{ stop: string; lines: string[] }>;
}>(location: T): T {
  return {
    ...location,
    ...locations[location.id],
    busStops: location.busStops.map((stop) => ({
      stop: translateTransit(stop.stop),
      lines: stop.lines.map(translateTransit)
    }))
  };
}
