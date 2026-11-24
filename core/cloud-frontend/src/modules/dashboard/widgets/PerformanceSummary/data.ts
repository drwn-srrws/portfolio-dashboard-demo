// eslint-disable-next-line @typescript-eslint/no-explicit-any
const flipPrices = (data: any[]) => {
  const reversedPrices = [...data]
    .reverse()
    .map((item) => parseFloat(item.price));
  return data.map((item, index) => ({
    ...item,
    price: Number(reversedPrices[index].toFixed(6)),
  }));
};

export const data = flipPrices(
  [
    {
      date: "2024-01-01",
      instrument_name: "Instrument A",
      price: "0.5395189307303524",
    },
    {
      date: "2024-01-02",
      instrument_name: "Instrument A",
      price: "0.5377951210230428",
    },
    {
      date: "2024-01-03",
      instrument_name: "Instrument A",
      price: "0.5247651217516813",
    },
    {
      date: "2024-01-04",
      instrument_name: "Instrument A",
      price: "0.5157139631047085",
    },
    {
      date: "2024-01-05",
      instrument_name: "Instrument A",
      price: "0.5059108341278348",
    },
    {
      date: "2024-01-08",
      instrument_name: "Instrument A",
      price: "0.5028906576144941",
    },
    {
      date: "2024-01-09",
      instrument_name: "Instrument A",
      price: "0.5046737881019306",
    },
    {
      date: "2024-01-10",
      instrument_name: "Instrument A",
      price: "0.5089448607689729",
    },
    {
      date: "2024-01-11",
      instrument_name: "Instrument A",
      price: "0.5108150888199195",
    },
    {
      date: "2024-01-12",
      instrument_name: "Instrument A",
      price: "0.5091993384476663",
    },
    {
      date: "2024-01-15",
      instrument_name: "Instrument A",
      price: "0.5105064258277927",
    },
    {
      date: "2024-01-16",
      instrument_name: "Instrument A",
      price: "0.5099835607142916",
    },
    {
      date: "2024-01-17",
      instrument_name: "Instrument A",
      price: "0.5080253957614692",
    },
    {
      date: "2024-01-18",
      instrument_name: "Instrument A",
      price: "0.4992861167684165",
    },
    {
      date: "2024-01-19",
      instrument_name: "Instrument A",
      price: "0.5031967579418477",
    },
    {
      date: "2024-01-22",
      instrument_name: "Instrument A",
      price: "0.5119109461456726",
    },
    {
      date: "2024-01-23",
      instrument_name: "Instrument A",
      price: "0.5070287775170743",
    },
    {
      date: "2024-01-24",
      instrument_name: "Instrument A",
      price: "0.5070205168626694",
    },
    {
      date: "2024-01-25",
      instrument_name: "Instrument A",
      price: "0.513888378501828",
    },
    {
      date: "2024-01-26",
      instrument_name: "Instrument A",
      price: "0.5106139838450772",
    },
    {
      date: "2024-01-29",
      instrument_name: "Instrument A",
      price: "0.4961954158814754",
    },
    {
      date: "2024-01-30",
      instrument_name: "Instrument A",
      price: "0.4859918545416817",
    },
    {
      date: "2024-01-31",
      instrument_name: "Instrument A",
      price: "0.4874655454112664",
    },
    {
      date: "2024-02-01",
      instrument_name: "Instrument A",
      price: "0.490951533476234",
    },
    {
      date: "2024-02-02",
      instrument_name: "Instrument A",
      price: "0.4891711593135897",
    },
    {
      date: "2024-02-05",
      instrument_name: "Instrument A",
      price: "0.4906580695136228",
    },
    {
      date: "2024-02-06",
      instrument_name: "Instrument A",
      price: "0.4906331794594585",
    },
    {
      date: "2024-02-07",
      instrument_name: "Instrument A",
      price: "0.4800326629506504",
    },
    {
      date: "2024-02-08",
      instrument_name: "Instrument A",
      price: "0.4840603673113243",
    },
    {
      date: "2024-02-09",
      instrument_name: "Instrument A",
      price: "0.4814404536086182",
    },
    {
      date: "2024-02-12",
      instrument_name: "Instrument A",
      price: "0.46136693895875314",
    },
    {
      date: "2024-02-13",
      instrument_name: "Instrument A",
      price: "0.4544452926727677",
    },
    {
      date: "2024-02-14",
      instrument_name: "Instrument A",
      price: "0.4544878409935543",
    },
    {
      date: "2024-02-15",
      instrument_name: "Instrument A",
      price: "0.4549491996954669",
    },
    {
      date: "2024-02-16",
      instrument_name: "Instrument A",
      price: "0.4558091941369524",
    },
    {
      date: "2024-02-19",
      instrument_name: "Instrument A",
      price: "0.4500720229717363",
    },
    {
      date: "2024-02-20",
      instrument_name: "Instrument A",
      price: "0.4472137860072066",
    },
    {
      date: "2024-02-21",
      instrument_name: "Instrument A",
      price: "0.43841267828704045",
    },
    {
      date: "2024-02-22",
      instrument_name: "Instrument A",
      price: "0.4338784036021972",
    },
    {
      date: "2024-02-23",
      instrument_name: "Instrument A",
      price: "0.43765391002825205",
    },
    {
      date: "2024-02-26",
      instrument_name: "Instrument A",
      price: "0.45455364562471157",
    },
    {
      date: "2024-02-27",
      instrument_name: "Instrument A",
      price: "0.4543083889455961",
    },
    {
      date: "2024-02-28",
      instrument_name: "Instrument A",
      price: "0.4623480696393185",
    },
    {
      date: "2024-02-29",
      instrument_name: "Instrument A",
      price: "0.47194831211117116",
    },
    {
      date: "2024-03-01",
      instrument_name: "Instrument A",
      price: "0.46260876489119995",
    },
    {
      date: "2024-03-04",
      instrument_name: "Instrument A",
      price: "0.4600112641050105",
    },
    {
      date: "2024-03-05",
      instrument_name: "Instrument A",
      price: "0.4617986420659772",
    },
    {
      date: "2024-03-06",
      instrument_name: "Instrument A",
      price: "0.4613320676793963",
    },
    {
      date: "2024-03-07",
      instrument_name: "Instrument A",
      price: "0.45698262334764583",
    },
    {
      date: "2024-03-08",
      instrument_name: "Instrument A",
      price: "0.45617739809267066",
    },
    {
      date: "2024-03-11",
      instrument_name: "Instrument A",
      price: "0.4642312360258358",
    },
    {
      date: "2024-03-12",
      instrument_name: "Instrument A",
      price: "0.46217377079465016",
    },
    {
      date: "2024-03-13",
      instrument_name: "Instrument A",
      price: "0.46376189111561794",
    },
    {
      date: "2024-03-14",
      instrument_name: "Instrument A",
      price: "0.4570436187334117",
    },
    {
      date: "2024-03-15",
      instrument_name: "Instrument A",
      price: "0.45387281650652245",
    },
    {
      date: "2024-03-18",
      instrument_name: "Instrument A",
      price: "0.44081011107672796",
    },
    {
      date: "2024-03-19",
      instrument_name: "Instrument A",
      price: "0.44170347018980716",
    },
    {
      date: "2024-03-20",
      instrument_name: "Instrument A",
      price: "0.4416804300414571",
    },
    {
      date: "2024-03-21",
      instrument_name: "Instrument A",
      price: "0.44504005743495534",
    },
    {
      date: "2024-03-22",
      instrument_name: "Instrument A",
      price: "0.44136530261423923",
    },
    {
      date: "2024-03-25",
      instrument_name: "Instrument A",
      price: "0.43980802024602217",
    },
    {
      date: "2024-03-26",
      instrument_name: "Instrument A",
      price: "0.44508955109635806",
    },
    {
      date: "2024-03-27",
      instrument_name: "Instrument A",
      price: "0.4468339755028319",
    },
    {
      date: "2024-03-28",
      instrument_name: "Instrument A",
      price: "0.4514677471544245",
    },
    {
      date: "2024-03-29",
      instrument_name: "Instrument A",
      price: "0.45095804673907347",
    },
    {
      date: "2024-04-01",
      instrument_name: "Instrument A",
      price: "0.448221865104812",
    },
    {
      date: "2024-04-02",
      instrument_name: "Instrument A",
      price: "0.4487832723185148",
    },
    {
      date: "2024-04-03",
      instrument_name: "Instrument A",
      price: "0.443134589119772",
    },
    {
      date: "2024-04-04",
      instrument_name: "Instrument A",
      price: "0.4541580341478263",
    },
    {
      date: "2024-04-05",
      instrument_name: "Instrument A",
      price: "0.45181539362415934",
    },
    {
      date: "2024-04-08",
      instrument_name: "Instrument A",
      price: "0.44679385049422593",
    },
    {
      date: "2024-04-09",
      instrument_name: "Instrument A",
      price: "0.4366290356141128",
    },
    {
      date: "2024-04-10",
      instrument_name: "Instrument A",
      price: "0.43970190565969325",
    },
    {
      date: "2024-04-11",
      instrument_name: "Instrument A",
      price: "0.4467764105637583",
    },
    {
      date: "2024-04-12",
      instrument_name: "Instrument A",
      price: "0.44243019229791614",
    },
    {
      date: "2024-04-15",
      instrument_name: "Instrument A",
      price: "0.42581873162244566",
    },
    {
      date: "2024-04-16",
      instrument_name: "Instrument A",
      price: "0.42189495349334494",
    },
    {
      date: "2024-04-17",
      instrument_name: "Instrument A",
      price: "0.42427462226218104",
    },
    {
      date: "2024-04-18",
      instrument_name: "Instrument A",
      price: "0.4233501072953766",
    },
    {
      date: "2024-04-19",
      instrument_name: "Instrument A",
      price: "0.4185303697711763",
    },
    {
      date: "2024-04-22",
      instrument_name: "Instrument A",
      price: "0.4211053488082672",
    },
    {
      date: "2024-04-23",
      instrument_name: "Instrument A",
      price: "0.42112273168306724",
    },
    {
      date: "2024-04-24",
      instrument_name: "Instrument A",
      price: "0.42305304136866184",
    },
    {
      date: "2024-04-25",
      instrument_name: "Instrument A",
      price: "0.42451135729378864",
    },
    {
      date: "2024-04-26",
      instrument_name: "Instrument A",
      price: "0.42404222799882596",
    },
    {
      date: "2024-04-29",
      instrument_name: "Instrument A",
      price: "0.429848568383169",
    },
    {
      date: "2024-04-30",
      instrument_name: "Instrument A",
      price: "0.42695302331488416",
    },
    {
      date: "2024-05-01",
      instrument_name: "Instrument A",
      price: "0.4234903918344105",
    },
    {
      date: "2024-05-02",
      instrument_name: "Instrument A",
      price: "0.42597879684075934",
    },
    {
      date: "2024-05-03",
      instrument_name: "Instrument A",
      price: "0.4221928593109595",
    },
    {
      date: "2024-05-06",
      instrument_name: "Instrument A",
      price: "0.4243000364264907",
    },
    {
      date: "2024-05-07",
      instrument_name: "Instrument A",
      price: "0.4296204998323063",
    },
    {
      date: "2024-05-08",
      instrument_name: "Instrument A",
      price: "0.4329385994692778",
    },
    {
      date: "2024-05-09",
      instrument_name: "Instrument A",
      price: "0.42638304059413723",
    },
    {
      date: "2024-05-10",
      instrument_name: "Instrument A",
      price: "0.4252001755731434",
    },
    {
      date: "2024-05-13",
      instrument_name: "Instrument A",
      price: "0.42412099535965364",
    },
    {
      date: "2024-05-14",
      instrument_name: "Instrument A",
      price: "0.42325261326136965",
    },
    {
      date: "2024-05-15",
      instrument_name: "Instrument A",
      price: "0.41380646982096747",
    },
    {
      date: "2024-05-16",
      instrument_name: "Instrument A",
      price: "0.4137325666137719",
    },
    {
      date: "2024-05-17",
      instrument_name: "Instrument A",
      price: "0.4088730268033489",
    },
    {
      date: "2024-05-20",
      instrument_name: "Instrument A",
      price: "0.3914096073862441",
    },
    {
      date: "2024-05-21",
      instrument_name: "Instrument A",
      price: "0.3873659561935294",
    },
    {
      date: "2024-05-22",
      instrument_name: "Instrument A",
      price: "0.3994496277262525",
    },
    {
      date: "2024-05-23",
      instrument_name: "Instrument A",
      price: "0.40202853996349686",
    },
    {
      date: "2024-05-24",
      instrument_name: "Instrument A",
      price: "0.3969492157028699",
    },
    {
      date: "2024-05-27",
      instrument_name: "Instrument A",
      price: "0.394224752644438",
    },
    {
      date: "2024-05-28",
      instrument_name: "Instrument A",
      price: "0.3878082958650013",
    },
    {
      date: "2024-05-29",
      instrument_name: "Instrument A",
      price: "0.3884164955285412",
    },
    {
      date: "2024-05-30",
      instrument_name: "Instrument A",
      price: "0.3945874439092365",
    },
    {
      date: "2024-05-31",
      instrument_name: "Instrument A",
      price: "0.38892021301664703",
    },
    {
      date: "2024-06-03",
      instrument_name: "Instrument A",
      price: "0.38982523451826623",
    },
    {
      date: "2024-06-04",
      instrument_name: "Instrument A",
      price: "0.37917763245640224",
    },
    {
      date: "2024-06-05",
      instrument_name: "Instrument A",
      price: "0.3808057044338442",
    },
    {
      date: "2024-06-06",
      instrument_name: "Instrument A",
      price: "0.38126603146463045",
    },
    {
      date: "2024-06-07",
      instrument_name: "Instrument A",
      price: "0.37665645521040136",
    },
    {
      date: "2024-06-10",
      instrument_name: "Instrument A",
      price: "0.3735221820722031",
    },
    {
      date: "2024-06-11",
      instrument_name: "Instrument A",
      price: "0.37412211462954637",
    },
    {
      date: "2024-06-12",
      instrument_name: "Instrument A",
      price: "0.3703410681355901",
    },
    {
      date: "2024-06-13",
      instrument_name: "Instrument A",
      price: "0.36565932238355003",
    },
    {
      date: "2024-06-14",
      instrument_name: "Instrument A",
      price: "0.35271225494739",
    },
    {
      date: "2024-06-17",
      instrument_name: "Instrument A",
      price: "0.3522983754061225",
    },
    {
      date: "2024-06-18",
      instrument_name: "Instrument A",
      price: "0.34401410220499856",
    },
    {
      date: "2024-06-19",
      instrument_name: "Instrument A",
      price: "0.34552022530749327",
    },
    {
      date: "2024-06-20",
      instrument_name: "Instrument A",
      price: "0.34794842556993466",
    },
    {
      date: "2024-06-21",
      instrument_name: "Instrument A",
      price: "0.3443466960367385",
    },
    {
      date: "2024-06-24",
      instrument_name: "Instrument A",
      price: "0.3411280427668165",
    },
    {
      date: "2024-06-25",
      instrument_name: "Instrument A",
      price: "0.3454564897157961",
    },
    {
      date: "2024-06-26",
      instrument_name: "Instrument A",
      price: "0.3569705028656269",
    },
    {
      date: "2024-06-27",
      instrument_name: "Instrument A",
      price: "0.34775248535988434",
    },
    {
      date: "2024-06-28",
      instrument_name: "Instrument A",
      price: "0.353229061282884",
    },
    {
      date: "2024-07-01",
      instrument_name: "Instrument A",
      price: "0.36230153784922897",
    },
    {
      date: "2024-07-02",
      instrument_name: "Instrument A",
      price: "0.36193512041911724",
    },
    {
      date: "2024-07-03",
      instrument_name: "Instrument A",
      price: "0.3650630354015321",
    },
    {
      date: "2024-07-04",
      instrument_name: "Instrument A",
      price: "0.36242005681581785",
    },
    {
      date: "2024-07-05",
      instrument_name: "Instrument A",
      price: "0.35787634997550327",
    },
    {
      date: "2024-07-08",
      instrument_name: "Instrument A",
      price: "0.3589042870783844",
    },
    {
      date: "2024-07-09",
      instrument_name: "Instrument A",
      price: "0.3583858252640316",
    },
    {
      date: "2024-07-10",
      instrument_name: "Instrument A",
      price: "0.3460664172786284",
    },
    {
      date: "2024-07-11",
      instrument_name: "Instrument A",
      price: "0.34252230529652344",
    },
    {
      date: "2024-07-12",
      instrument_name: "Instrument A",
      price: "0.34352429654185623",
    },
    {
      date: "2024-07-15",
      instrument_name: "Instrument A",
      price: "0.3333477841132628",
    },
    {
      date: "2024-07-16",
      instrument_name: "Instrument A",
      price: "0.3335224596398305",
    },
    {
      date: "2024-07-17",
      instrument_name: "Instrument A",
      price: "0.3350689563663893",
    },
    {
      date: "2024-07-18",
      instrument_name: "Instrument A",
      price: "0.3320303758757078",
    },
    {
      date: "2024-07-19",
      instrument_name: "Instrument A",
      price: "0.3340156245866508",
    },
    {
      date: "2024-07-22",
      instrument_name: "Instrument A",
      price: "0.3458328247288619",
    },
    {
      date: "2024-07-23",
      instrument_name: "Instrument A",
      price: "0.34715344532853165",
    },
    {
      date: "2024-07-24",
      instrument_name: "Instrument A",
      price: "0.3421340818585571",
    },
    {
      date: "2024-07-25",
      instrument_name: "Instrument A",
      price: "0.3525238353167218",
    },
    {
      date: "2024-07-26",
      instrument_name: "Instrument A",
      price: "0.35380983678637623",
    },
    {
      date: "2024-07-29",
      instrument_name: "Instrument A",
      price: "0.3498472371905892",
    },
    {
      date: "2024-07-30",
      instrument_name: "Instrument A",
      price: "0.35001410368417785",
    },
    {
      date: "2024-07-31",
      instrument_name: "Instrument A",
      price: "0.35724922257180414",
    },
    {
      date: "2024-08-01",
      instrument_name: "Instrument A",
      price: "0.3550287237810854",
    },
    {
      date: "2024-08-02",
      instrument_name: "Instrument A",
      price: "0.35422276782342443",
    },
    {
      date: "2024-08-05",
      instrument_name: "Instrument A",
      price: "0.36053755832077594",
    },
    {
      date: "2024-08-06",
      instrument_name: "Instrument A",
      price: "0.36425211112468414",
    },
    {
      date: "2024-08-07",
      instrument_name: "Instrument A",
      price: "0.3625960066505089",
    },
    {
      date: "2024-08-08",
      instrument_name: "Instrument A",
      price: "0.36347299488671825",
    },
    {
      date: "2024-08-09",
      instrument_name: "Instrument A",
      price: "0.3661063090453338",
    },
    {
      date: "2024-08-12",
      instrument_name: "Instrument A",
      price: "0.36342902929591503",
    },
    {
      date: "2024-08-13",
      instrument_name: "Instrument A",
      price: "0.3593813916713223",
    },
    {
      date: "2024-08-14",
      instrument_name: "Instrument A",
      price: "0.3510739866374297",
    },
    {
      date: "2024-08-15",
      instrument_name: "Instrument A",
      price: "0.34788447518813415",
    },
    {
      date: "2024-08-16",
      instrument_name: "Instrument A",
      price: "0.34313476194899273",
    },
    {
      date: "2024-08-19",
      instrument_name: "Instrument A",
      price: "0.3335453848710439",
    },
    {
      date: "2024-08-20",
      instrument_name: "Instrument A",
      price: "0.32299983066831806",
    },
    {
      date: "2024-08-21",
      instrument_name: "Instrument A",
      price: "0.3185822348552714",
    },
    {
      date: "2024-08-22",
      instrument_name: "Instrument A",
      price: "0.3202161875934143",
    },
    {
      date: "2024-08-23",
      instrument_name: "Instrument A",
      price: "0.32098831259872246",
    },
    {
      date: "2024-08-26",
      instrument_name: "Instrument A",
      price: "0.3177013932299875",
    },
    {
      date: "2024-08-27",
      instrument_name: "Instrument A",
      price: "0.31934146343083286",
    },
    {
      date: "2024-08-28",
      instrument_name: "Instrument A",
      price: "0.3168553320633717",
    },
    {
      date: "2024-08-29",
      instrument_name: "Instrument A",
      price: "0.31183925057861317",
    },
    {
      date: "2024-08-30",
      instrument_name: "Instrument A",
      price: "0.30814171690824915",
    },
    {
      date: "2024-09-02",
      instrument_name: "Instrument A",
      price: "0.31644075868754257",
    },
    {
      date: "2024-09-03",
      instrument_name: "Instrument A",
      price: "0.31757348937043767",
    },
    {
      date: "2024-09-04",
      instrument_name: "Instrument A",
      price: "0.3088454423247763",
    },
    {
      date: "2024-09-05",
      instrument_name: "Instrument A",
      price: "0.31874531676652995",
    },
    {
      date: "2024-09-06",
      instrument_name: "Instrument A",
      price: "0.319948962107032",
    },
    {
      date: "2024-09-09",
      instrument_name: "Instrument A",
      price: "0.324187423758623",
    },
    {
      date: "2024-09-10",
      instrument_name: "Instrument A",
      price: "0.3180496862258321",
    },
    {
      date: "2024-09-11",
      instrument_name: "Instrument A",
      price: "0.32042663188435927",
    },
    {
      date: "2024-09-12",
      instrument_name: "Instrument A",
      price: "0.30935626574333375",
    },
    {
      date: "2024-09-13",
      instrument_name: "Instrument A",
      price: "0.3120701086202944",
    },
    {
      date: "2024-09-16",
      instrument_name: "Instrument A",
      price: "0.3128274323085929",
    },
    {
      date: "2024-09-17",
      instrument_name: "Instrument A",
      price: "0.31626881945130475",
    },
    {
      date: "2024-09-18",
      instrument_name: "Instrument A",
      price: "0.32171852807210227",
    },
    {
      date: "2024-09-19",
      instrument_name: "Instrument A",
      price: "0.326650570560551",
    },
    {
      date: "2024-09-20",
      instrument_name: "Instrument A",
      price: "0.3233569571162114",
    },
    {
      date: "2024-09-23",
      instrument_name: "Instrument A",
      price: "0.3122727422264494",
    },
    {
      date: "2024-09-24",
      instrument_name: "Instrument A",
      price: "0.3185638169380794",
    },
    {
      date: "2024-09-25",
      instrument_name: "Instrument A",
      price: "0.315966433196158",
    },
    {
      date: "2024-09-26",
      instrument_name: "Instrument A",
      price: "0.305954224033014",
    },
    {
      date: "2024-09-27",
      instrument_name: "Instrument A",
      price: "0.31535051888988047",
    },
    {
      date: "2024-09-30",
      instrument_name: "Instrument A",
      price: "0.3150652145432776",
    },
    {
      date: "2024-10-01",
      instrument_name: "Instrument A",
      price: "0.31581329766613675",
    },
    {
      date: "2024-10-02",
      instrument_name: "Instrument A",
      price: "0.3164289727907924",
    },
    {
      date: "2024-10-03",
      instrument_name: "Instrument A",
      price: "0.31164934877788375",
    },
    {
      date: "2024-10-04",
      instrument_name: "Instrument A",
      price: "0.31012805062047766",
    },
    {
      date: "2024-10-07",
      instrument_name: "Instrument A",
      price: "0.3037447964891108",
    },
    {
      date: "2024-10-08",
      instrument_name: "Instrument A",
      price: "0.29933835546436005",
    },
    {
      date: "2024-10-09",
      instrument_name: "Instrument A",
      price: "0.3082026449167025",
    },
    {
      date: "2024-10-10",
      instrument_name: "Instrument A",
      price: "0.3003499876242369",
    },
    {
      date: "2024-10-11",
      instrument_name: "Instrument A",
      price: "0.29837691114546866",
    },
    {
      date: "2024-10-14",
      instrument_name: "Instrument A",
      price: "0.2990346318918674",
    },
    {
      date: "2024-10-15",
      instrument_name: "Instrument A",
      price: "0.29344015467975665",
    },
    {
      date: "2024-10-16",
      instrument_name: "Instrument A",
      price: "0.2905116022953187",
    },
    {
      date: "2024-10-17",
      instrument_name: "Instrument A",
      price: "0.2931119313291441",
    },
    {
      date: "2024-10-18",
      instrument_name: "Instrument A",
      price: "0.29290552549894205",
    },
    {
      date: "2024-10-21",
      instrument_name: "Instrument A",
      price: "0.2865805020001059",
    },
    {
      date: "2024-10-22",
      instrument_name: "Instrument A",
      price: "0.29156619452801324",
    },
    {
      date: "2024-10-23",
      instrument_name: "Instrument A",
      price: "0.282846389882818",
    },
    {
      date: "2024-10-24",
      instrument_name: "Instrument A",
      price: "0.2786876443995326",
    },
    {
      date: "2024-10-25",
      instrument_name: "Instrument A",
      price: "0.2689377365221156",
    },
    {
      date: "2024-10-28",
      instrument_name: "Instrument A",
      price: "0.2748163186075756",
    },
    {
      date: "2024-10-29",
      instrument_name: "Instrument A",
      price: "0.2691165188052088",
    },
    {
      date: "2024-10-30",
      instrument_name: "Instrument A",
      price: "0.2635630868181458",
    },
    {
      date: "2024-10-31",
      instrument_name: "Instrument A",
      price: "0.2614056010489918",
    },
    {
      date: "2024-11-01",
      instrument_name: "Instrument A",
      price: "0.2592290410922439",
    },
    {
      date: "2024-11-04",
      instrument_name: "Instrument A",
      price: "0.26060261231415405",
    },
    {
      date: "2024-11-05",
      instrument_name: "Instrument A",
      price: "0.25840306243812444",
    },
    {
      date: "2024-11-06",
      instrument_name: "Instrument A",
      price: "0.25400707793213495",
    },
    {
      date: "2024-11-07",
      instrument_name: "Instrument A",
      price: "0.25168299788563975",
    },
    {
      date: "2024-11-08",
      instrument_name: "Instrument A",
      price: "0.25269349006520436",
    },
    {
      date: "2024-11-11",
      instrument_name: "Instrument A",
      price: "0.2479720012354607",
    },
    {
      date: "2024-11-12",
      instrument_name: "Instrument A",
      price: "0.25229837552199763",
    },
    {
      date: "2024-11-13",
      instrument_name: "Instrument A",
      price: "0.24713532887644674",
    },
    {
      date: "2024-11-14",
      instrument_name: "Instrument A",
      price: "0.2477672449850441",
    },
    {
      date: "2024-11-15",
      instrument_name: "Instrument A",
      price: "0.24697088191673505",
    },
    {
      date: "2024-11-18",
      instrument_name: "Instrument A",
      price: "0.24482729466677033",
    },
    {
      date: "2024-11-19",
      instrument_name: "Instrument A",
      price: "0.22624478189954247",
    },
    {
      date: "2024-11-20",
      instrument_name: "Instrument A",
      price: "0.23125493471158737",
    },
    {
      date: "2024-11-21",
      instrument_name: "Instrument A",
      price: "0.22602019610982688",
    },
    {
      date: "2024-11-22",
      instrument_name: "Instrument A",
      price: "0.22738778092878983",
    },
    {
      date: "2024-11-25",
      instrument_name: "Instrument A",
      price: "0.23450994241688802",
    },
    {
      date: "2024-11-26",
      instrument_name: "Instrument A",
      price: "0.2296921967839275",
    },
    {
      date: "2024-11-27",
      instrument_name: "Instrument A",
      price: "0.22099622211458236",
    },
    {
      date: "2024-11-28",
      instrument_name: "Instrument A",
      price: "0.21858000661042717",
    },
    {
      date: "2024-11-29",
      instrument_name: "Instrument A",
      price: "0.2081169297362218",
    },
    {
      date: "2024-12-02",
      instrument_name: "Instrument A",
      price: "0.1980451690235015",
    },
    {
      date: "2024-12-03",
      instrument_name: "Instrument A",
      price: "0.19758183758053577",
    },
    {
      date: "2024-12-04",
      instrument_name: "Instrument A",
      price: "0.19572911779614943",
    },
    {
      date: "2024-12-05",
      instrument_name: "Instrument A",
      price: "0.19341848535971523",
    },
    {
      date: "2024-12-06",
      instrument_name: "Instrument A",
      price: "0.1806255325447384",
    },
    {
      date: "2024-12-09",
      instrument_name: "Instrument A",
      price: "0.17936997247595138",
    },
    {
      date: "2024-12-10",
      instrument_name: "Instrument A",
      price: "0.1695038891562661",
    },
    {
      date: "2024-12-11",
      instrument_name: "Instrument A",
      price: "0.16475809852030515",
    },
    {
      date: "2024-12-12",
      instrument_name: "Instrument A",
      price: "0.16944572562851049",
    },
    {
      date: "2024-12-13",
      instrument_name: "Instrument A",
      price: "0.16518333183169445",
    },
    {
      date: "2024-12-16",
      instrument_name: "Instrument A",
      price: "0.16801041879456058",
    },
    {
      date: "2024-12-17",
      instrument_name: "Instrument A",
      price: "0.1648146220138347",
    },
    {
      date: "2024-12-18",
      instrument_name: "Instrument A",
      price: "0.16335723883108125",
    },
    {
      date: "2024-12-19",
      instrument_name: "Instrument A",
      price: "0.1719520930907901",
    },
    {
      date: "2024-12-20",
      instrument_name: "Instrument A",
      price: "0.1735109025424472",
    },
    {
      date: "2024-01-01",
      instrument_name: "Instrument B",
      price: "0.5734017471283914",
    },
    {
      date: "2024-01-02",
      instrument_name: "Instrument B",
      price: "0.5705917603465765",
    },
    {
      date: "2024-01-03",
      instrument_name: "Instrument B",
      price: "0.5730976579840752",
    },
    {
      date: "2024-01-04",
      instrument_name: "Instrument B",
      price: "0.5762079698303223",
    },
    {
      date: "2024-01-05",
      instrument_name: "Instrument B",
      price: "0.570653890279538",
    },
    {
      date: "2024-01-08",
      instrument_name: "Instrument B",
      price: "0.5728907019690738",
    },
    {
      date: "2024-01-09",
      instrument_name: "Instrument B",
      price: "0.5682810699507252",
    },
    {
      date: "2024-01-10",
      instrument_name: "Instrument B",
      price: "0.5660929728081738",
    },
    {
      date: "2024-01-11",
      instrument_name: "Instrument B",
      price: "0.5607540744786527",
    },
    {
      date: "2024-01-12",
      instrument_name: "Instrument B",
      price: "0.5551747966246643",
    },
    {
      date: "2024-01-15",
      instrument_name: "Instrument B",
      price: "0.5482219155400497",
    },
    {
      date: "2024-01-16",
      instrument_name: "Instrument B",
      price: "0.5589189917740847",
    },
    {
      date: "2024-01-17",
      instrument_name: "Instrument B",
      price: "0.553107529574098",
    },
    {
      date: "2024-01-18",
      instrument_name: "Instrument B",
      price: "0.5583798573757878",
    },
    {
      date: "2024-01-19",
      instrument_name: "Instrument B",
      price: "0.5508093521642717",
    },
    {
      date: "2024-01-22",
      instrument_name: "Instrument B",
      price: "0.5481292173300044",
    },
    {
      date: "2024-01-23",
      instrument_name: "Instrument B",
      price: "0.5489247419454261",
    },
    {
      date: "2024-01-24",
      instrument_name: "Instrument B",
      price: "0.5490478542236658",
    },
    {
      date: "2024-01-25",
      instrument_name: "Instrument B",
      price: "0.5447973413018485",
    },
    {
      date: "2024-01-26",
      instrument_name: "Instrument B",
      price: "0.5403204598945066",
    },
    {
      date: "2024-01-29",
      instrument_name: "Instrument B",
      price: "0.527145125610599",
    },
    {
      date: "2024-01-30",
      instrument_name: "Instrument B",
      price: "0.526976813389778",
    },
    {
      date: "2024-01-31",
      instrument_name: "Instrument B",
      price: "0.5297510163069746",
    },
    {
      date: "2024-02-01",
      instrument_name: "Instrument B",
      price: "0.5306031044626879",
    },
    {
      date: "2024-02-02",
      instrument_name: "Instrument B",
      price: "0.5267992609691947",
    },
    {
      date: "2024-02-05",
      instrument_name: "Instrument B",
      price: "0.5220681008301925",
    },
    {
      date: "2024-02-06",
      instrument_name: "Instrument B",
      price: "0.5204612763045191",
    },
    {
      date: "2024-02-07",
      instrument_name: "Instrument B",
      price: "0.5232070761910358",
    },
    {
      date: "2024-02-08",
      instrument_name: "Instrument B",
      price: "0.5196468176155782",
    },
    {
      date: "2024-02-09",
      instrument_name: "Instrument B",
      price: "0.5238495426870228",
    },
    {
      date: "2024-02-12",
      instrument_name: "Instrument B",
      price: "0.5110318903030198",
    },
    {
      date: "2024-02-13",
      instrument_name: "Instrument B",
      price: "0.514262250984153",
    },
    {
      date: "2024-02-14",
      instrument_name: "Instrument B",
      price: "0.5138078511303",
    },
    {
      date: "2024-02-15",
      instrument_name: "Instrument B",
      price: "0.5087208543881732",
    },
    {
      date: "2024-02-16",
      instrument_name: "Instrument B",
      price: "0.5065516156733607",
    },
    {
      date: "2024-02-19",
      instrument_name: "Instrument B",
      price: "0.4936674283434864",
    },
    {
      date: "2024-02-20",
      instrument_name: "Instrument B",
      price: "0.48144805058502993",
    },
    {
      date: "2024-02-21",
      instrument_name: "Instrument B",
      price: "0.47397645637500263",
    },
    {
      date: "2024-02-22",
      instrument_name: "Instrument B",
      price: "0.4716802990588076",
    },
    {
      date: "2024-02-23",
      instrument_name: "Instrument B",
      price: "0.4649212582598765",
    },
    {
      date: "2024-02-26",
      instrument_name: "Instrument B",
      price: "0.47221398801563097",
    },
    {
      date: "2024-02-27",
      instrument_name: "Instrument B",
      price: "0.45900406633615054",
    },
    {
      date: "2024-02-28",
      instrument_name: "Instrument B",
      price: "0.4561885872617091",
    },
    {
      date: "2024-02-29",
      instrument_name: "Instrument B",
      price: "0.45251231800525693",
    },
    {
      date: "2024-03-01",
      instrument_name: "Instrument B",
      price: "0.447553858731327",
    },
    {
      date: "2024-03-04",
      instrument_name: "Instrument B",
      price: "0.4403583339446083",
    },
    {
      date: "2024-03-05",
      instrument_name: "Instrument B",
      price: "0.4440029037128903",
    },
    {
      date: "2024-03-06",
      instrument_name: "Instrument B",
      price: "0.4472166354016017",
    },
    {
      date: "2024-03-07",
      instrument_name: "Instrument B",
      price: "0.4463388921396374",
    },
    {
      date: "2024-03-08",
      instrument_name: "Instrument B",
      price: "0.4561469036178979",
    },
    {
      date: "2024-03-11",
      instrument_name: "Instrument B",
      price: "0.45836306611080935",
    },
    {
      date: "2024-03-12",
      instrument_name: "Instrument B",
      price: "0.46486501492131194",
    },
    {
      date: "2024-03-13",
      instrument_name: "Instrument B",
      price: "0.4697147313317187",
    },
    {
      date: "2024-03-14",
      instrument_name: "Instrument B",
      price: "0.4624744083091906",
    },
    {
      date: "2024-03-15",
      instrument_name: "Instrument B",
      price: "0.4677153279019274",
    },
    {
      date: "2024-03-18",
      instrument_name: "Instrument B",
      price: "0.4521783122689168",
    },
    {
      date: "2024-03-19",
      instrument_name: "Instrument B",
      price: "0.45064554429202086",
    },
    {
      date: "2024-03-20",
      instrument_name: "Instrument B",
      price: "0.4503962193625143",
    },
    {
      date: "2024-03-21",
      instrument_name: "Instrument B",
      price: "0.45814467062965836",
    },
    {
      date: "2024-03-22",
      instrument_name: "Instrument B",
      price: "0.4627426526649948",
    },
    {
      date: "2024-03-25",
      instrument_name: "Instrument B",
      price: "0.46534161713235667",
    },
    {
      date: "2024-03-26",
      instrument_name: "Instrument B",
      price: "0.4655832170690357",
    },
    {
      date: "2024-03-27",
      instrument_name: "Instrument B",
      price: "0.4624592592704728",
    },
    {
      date: "2024-03-28",
      instrument_name: "Instrument B",
      price: "0.4596102099858487",
    },
    {
      date: "2024-03-29",
      instrument_name: "Instrument B",
      price: "0.4613493883347265",
    },
    {
      date: "2024-04-01",
      instrument_name: "Instrument B",
      price: "0.4482891960480464",
    },
    {
      date: "2024-04-02",
      instrument_name: "Instrument B",
      price: "0.441648395408183",
    },
    {
      date: "2024-04-03",
      instrument_name: "Instrument B",
      price: "0.4445586530128367",
    },
    {
      date: "2024-04-04",
      instrument_name: "Instrument B",
      price: "0.4337162760226504",
    },
    {
      date: "2024-04-05",
      instrument_name: "Instrument B",
      price: "0.4394489941010795",
    },
    {
      date: "2024-04-08",
      instrument_name: "Instrument B",
      price: "0.4472603564773602",
    },
    {
      date: "2024-04-09",
      instrument_name: "Instrument B",
      price: "0.44971604286574773",
    },
    {
      date: "2024-04-10",
      instrument_name: "Instrument B",
      price: "0.4489434902205097",
    },
    {
      date: "2024-04-11",
      instrument_name: "Instrument B",
      price: "0.4418858576291599",
    },
    {
      date: "2024-04-12",
      instrument_name: "Instrument B",
      price: "0.4465340355010614",
    },
    {
      date: "2024-04-15",
      instrument_name: "Instrument B",
      price: "0.43990639690069855",
    },
    {
      date: "2024-04-16",
      instrument_name: "Instrument B",
      price: "0.4390342253735049",
    },
    {
      date: "2024-04-17",
      instrument_name: "Instrument B",
      price: "0.43571491539191565",
    },
    {
      date: "2024-04-18",
      instrument_name: "Instrument B",
      price: "0.43625147458953606",
    },
    {
      date: "2024-04-19",
      instrument_name: "Instrument B",
      price: "0.442103257785431",
    },
    {
      date: "2024-04-22",
      instrument_name: "Instrument B",
      price: "0.4361833621325588",
    },
    {
      date: "2024-04-23",
      instrument_name: "Instrument B",
      price: "0.4385540700224043",
    },
    {
      date: "2024-04-24",
      instrument_name: "Instrument B",
      price: "0.44145951220951973",
    },
    {
      date: "2024-04-25",
      instrument_name: "Instrument B",
      price: "0.4449480309771018",
    },
    {
      date: "2024-04-26",
      instrument_name: "Instrument B",
      price: "0.4450693844938448",
    },
    {
      date: "2024-04-29",
      instrument_name: "Instrument B",
      price: "0.4442763227416875",
    },
    {
      date: "2024-04-30",
      instrument_name: "Instrument B",
      price: "0.4352978597810945",
    },
    {
      date: "2024-05-01",
      instrument_name: "Instrument B",
      price: "0.4290137436388616",
    },
    {
      date: "2024-05-02",
      instrument_name: "Instrument B",
      price: "0.42830436673796446",
    },
    {
      date: "2024-05-03",
      instrument_name: "Instrument B",
      price: "0.42418214645007557",
    },
    {
      date: "2024-05-06",
      instrument_name: "Instrument B",
      price: "0.43298583428963733",
    },
    {
      date: "2024-05-07",
      instrument_name: "Instrument B",
      price: "0.43153726745668053",
    },
    {
      date: "2024-05-08",
      instrument_name: "Instrument B",
      price: "0.4347092551815508",
    },
    {
      date: "2024-05-09",
      instrument_name: "Instrument B",
      price: "0.43241972515018934",
    },
    {
      date: "2024-05-10",
      instrument_name: "Instrument B",
      price: "0.4327851553177149",
    },
    {
      date: "2024-05-13",
      instrument_name: "Instrument B",
      price: "0.4289144549730437",
    },
    {
      date: "2024-05-14",
      instrument_name: "Instrument B",
      price: "0.43484592706197933",
    },
    {
      date: "2024-05-15",
      instrument_name: "Instrument B",
      price: "0.43772830489456294",
    },
    {
      date: "2024-05-16",
      instrument_name: "Instrument B",
      price: "0.42626706349969234",
    },
    {
      date: "2024-05-17",
      instrument_name: "Instrument B",
      price: "0.42273819684612735",
    },
    {
      date: "2024-05-20",
      instrument_name: "Instrument B",
      price: "0.419473594337167",
    },
    {
      date: "2024-05-21",
      instrument_name: "Instrument B",
      price: "0.4193814371737785",
    },
    {
      date: "2024-05-22",
      instrument_name: "Instrument B",
      price: "0.41224510181609386",
    },
    {
      date: "2024-05-23",
      instrument_name: "Instrument B",
      price: "0.4101408406278938",
    },
    {
      date: "2024-05-24",
      instrument_name: "Instrument B",
      price: "0.41266134186256787",
    },
    {
      date: "2024-05-27",
      instrument_name: "Instrument B",
      price: "0.4094312724125534",
    },
    {
      date: "2024-05-28",
      instrument_name: "Instrument B",
      price: "0.41733404785634187",
    },
    {
      date: "2024-05-29",
      instrument_name: "Instrument B",
      price: "0.41945298501772754",
    },
    {
      date: "2024-05-30",
      instrument_name: "Instrument B",
      price: "0.425769505579479",
    },
    {
      date: "2024-05-31",
      instrument_name: "Instrument B",
      price: "0.4226932474867475",
    },
    {
      date: "2024-06-03",
      instrument_name: "Instrument B",
      price: "0.42253751141856644",
    },
    {
      date: "2024-06-04",
      instrument_name: "Instrument B",
      price: "0.4245519224470641",
    },
    {
      date: "2024-06-05",
      instrument_name: "Instrument B",
      price: "0.41976888983838323",
    },
    {
      date: "2024-06-06",
      instrument_name: "Instrument B",
      price: "0.42281736626254374",
    },
    {
      date: "2024-06-07",
      instrument_name: "Instrument B",
      price: "0.4144897495643607",
    },
    {
      date: "2024-06-10",
      instrument_name: "Instrument B",
      price: "0.4153739320500781",
    },
    {
      date: "2024-06-11",
      instrument_name: "Instrument B",
      price: "0.41883334180160225",
    },
    {
      date: "2024-06-12",
      instrument_name: "Instrument B",
      price: "0.42713660676033005",
    },
    {
      date: "2024-06-13",
      instrument_name: "Instrument B",
      price: "0.41537613936303075",
    },
    {
      date: "2024-06-14",
      instrument_name: "Instrument B",
      price: "0.42081918326040235",
    },
    {
      date: "2024-06-17",
      instrument_name: "Instrument B",
      price: "0.4257937108778199",
    },
    {
      date: "2024-06-18",
      instrument_name: "Instrument B",
      price: "0.43286179715918605",
    },
    {
      date: "2024-06-19",
      instrument_name: "Instrument B",
      price: "0.4289765379977656",
    },
    {
      date: "2024-06-20",
      instrument_name: "Instrument B",
      price: "0.4340622400657419",
    },
    {
      date: "2024-06-21",
      instrument_name: "Instrument B",
      price: "0.43369394788356275",
    },
    {
      date: "2024-06-24",
      instrument_name: "Instrument B",
      price: "0.4280305689011098",
    },
    {
      date: "2024-06-25",
      instrument_name: "Instrument B",
      price: "0.4122396617829839",
    },
    {
      date: "2024-06-26",
      instrument_name: "Instrument B",
      price: "0.41310105244949435",
    },
    {
      date: "2024-06-27",
      instrument_name: "Instrument B",
      price: "0.41159419025793065",
    },
    {
      date: "2024-06-28",
      instrument_name: "Instrument B",
      price: "0.4133971080116252",
    },
    {
      date: "2024-07-01",
      instrument_name: "Instrument B",
      price: "0.4228148522249171",
    },
    {
      date: "2024-07-02",
      instrument_name: "Instrument B",
      price: "0.4203919265835968",
    },
    {
      date: "2024-07-03",
      instrument_name: "Instrument B",
      price: "0.4218905549119242",
    },
    {
      date: "2024-07-04",
      instrument_name: "Instrument B",
      price: "0.41955899392411067",
    },
    {
      date: "2024-07-05",
      instrument_name: "Instrument B",
      price: "0.41983545809127365",
    },
    {
      date: "2024-07-08",
      instrument_name: "Instrument B",
      price: "0.41075130815539984",
    },
    {
      date: "2024-07-09",
      instrument_name: "Instrument B",
      price: "0.4049494380251495",
    },
    {
      date: "2024-07-10",
      instrument_name: "Instrument B",
      price: "0.4146399303621058",
    },
    {
      date: "2024-07-11",
      instrument_name: "Instrument B",
      price: "0.40903306650899796",
    },
    {
      date: "2024-07-12",
      instrument_name: "Instrument B",
      price: "0.40887970062280077",
    },
    {
      date: "2024-07-15",
      instrument_name: "Instrument B",
      price: "0.399414371119891",
    },
    {
      date: "2024-07-16",
      instrument_name: "Instrument B",
      price: "0.4034279682361618",
    },
    {
      date: "2024-07-17",
      instrument_name: "Instrument B",
      price: "0.41342056216454903",
    },
    {
      date: "2024-07-18",
      instrument_name: "Instrument B",
      price: "0.4090346789756387",
    },
    {
      date: "2024-07-19",
      instrument_name: "Instrument B",
      price: "0.4149313362856384",
    },
    {
      date: "2024-07-22",
      instrument_name: "Instrument B",
      price: "0.4309288290892994",
    },
    {
      date: "2024-07-23",
      instrument_name: "Instrument B",
      price: "0.4295721170273502",
    },
    {
      date: "2024-07-24",
      instrument_name: "Instrument B",
      price: "0.42178259961946996",
    },
    {
      date: "2024-07-25",
      instrument_name: "Instrument B",
      price: "0.4263348345532435",
    },
    {
      date: "2024-07-26",
      instrument_name: "Instrument B",
      price: "0.4272687335895571",
    },
    {
      date: "2024-07-29",
      instrument_name: "Instrument B",
      price: "0.42309143911569913",
    },
    {
      date: "2024-07-30",
      instrument_name: "Instrument B",
      price: "0.42870499301712706",
    },
    {
      date: "2024-07-31",
      instrument_name: "Instrument B",
      price: "0.4301157559865003",
    },
    {
      date: "2024-08-01",
      instrument_name: "Instrument B",
      price: "0.4227097838121747",
    },
    {
      date: "2024-08-02",
      instrument_name: "Instrument B",
      price: "0.42595597292478227",
    },
    {
      date: "2024-08-05",
      instrument_name: "Instrument B",
      price: "0.43429482645398765",
    },
    {
      date: "2024-08-06",
      instrument_name: "Instrument B",
      price: "0.43101577363884436",
    },
    {
      date: "2024-08-07",
      instrument_name: "Instrument B",
      price: "0.4299826541446632",
    },
    {
      date: "2024-08-08",
      instrument_name: "Instrument B",
      price: "0.4336377075810972",
    },
    {
      date: "2024-08-09",
      instrument_name: "Instrument B",
      price: "0.43383333532934387",
    },
    {
      date: "2024-08-12",
      instrument_name: "Instrument B",
      price: "0.4251937064524718",
    },
    {
      date: "2024-08-13",
      instrument_name: "Instrument B",
      price: "0.42929050067364616",
    },
    {
      date: "2024-08-14",
      instrument_name: "Instrument B",
      price: "0.4298584053902149",
    },
    {
      date: "2024-08-15",
      instrument_name: "Instrument B",
      price: "0.43014275665204493",
    },
    {
      date: "2024-08-16",
      instrument_name: "Instrument B",
      price: "0.42471331383004274",
    },
    {
      date: "2024-08-19",
      instrument_name: "Instrument B",
      price: "0.42396645002760835",
    },
    {
      date: "2024-08-20",
      instrument_name: "Instrument B",
      price: "0.4236155119087628",
    },
    {
      date: "2024-08-21",
      instrument_name: "Instrument B",
      price: "0.41874509464711085",
    },
    {
      date: "2024-08-22",
      instrument_name: "Instrument B",
      price: "0.41263769443844556",
    },
    {
      date: "2024-08-23",
      instrument_name: "Instrument B",
      price: "0.4120252122100918",
    },
    {
      date: "2024-08-26",
      instrument_name: "Instrument B",
      price: "0.4200216698011896",
    },
    {
      date: "2024-08-27",
      instrument_name: "Instrument B",
      price: "0.41958263645961325",
    },
    {
      date: "2024-08-28",
      instrument_name: "Instrument B",
      price: "0.41314408186635165",
    },
    {
      date: "2024-08-29",
      instrument_name: "Instrument B",
      price: "0.4160170949374793",
    },
    {
      date: "2024-08-30",
      instrument_name: "Instrument B",
      price: "0.4178193818308388",
    },
    {
      date: "2024-09-02",
      instrument_name: "Instrument B",
      price: "0.43201193831082996",
    },
    {
      date: "2024-09-03",
      instrument_name: "Instrument B",
      price: "0.4294733938094796",
    },
    {
      date: "2024-09-04",
      instrument_name: "Instrument B",
      price: "0.43030854899552295",
    },
    {
      date: "2024-09-05",
      instrument_name: "Instrument B",
      price: "0.4295652946814572",
    },
    {
      date: "2024-09-06",
      instrument_name: "Instrument B",
      price: "0.43414409534424014",
    },
    {
      date: "2024-09-09",
      instrument_name: "Instrument B",
      price: "0.42891864566642346",
    },
    {
      date: "2024-09-10",
      instrument_name: "Instrument B",
      price: "0.4353973951641187",
    },
    {
      date: "2024-09-11",
      instrument_name: "Instrument B",
      price: "0.4381185779448278",
    },
    {
      date: "2024-09-12",
      instrument_name: "Instrument B",
      price: "0.4363329405885574",
    },
    {
      date: "2024-09-13",
      instrument_name: "Instrument B",
      price: "0.43885912032566887",
    },
    {
      date: "2024-09-16",
      instrument_name: "Instrument B",
      price: "0.4356130543187704",
    },
    {
      date: "2024-09-17",
      instrument_name: "Instrument B",
      price: "0.4334389124827963",
    },
    {
      date: "2024-09-18",
      instrument_name: "Instrument B",
      price: "0.4412459980567829",
    },
    {
      date: "2024-09-19",
      instrument_name: "Instrument B",
      price: "0.44387380307071245",
    },
    {
      date: "2024-09-20",
      instrument_name: "Instrument B",
      price: "0.4525486494088765",
    },
    {
      date: "2024-09-23",
      instrument_name: "Instrument B",
      price: "0.4562971586298",
    },
    {
      date: "2024-09-24",
      instrument_name: "Instrument B",
      price: "0.44770032894974887",
    },
    {
      date: "2024-09-25",
      instrument_name: "Instrument B",
      price: "0.44603463049867653",
    },
    {
      date: "2024-09-26",
      instrument_name: "Instrument B",
      price: "0.44531379796929915",
    },
    {
      date: "2024-09-27",
      instrument_name: "Instrument B",
      price: "0.4370278308220551",
    },
    {
      date: "2024-09-30",
      instrument_name: "Instrument B",
      price: "0.43750155858550144",
    },
    {
      date: "2024-10-01",
      instrument_name: "Instrument B",
      price: "0.43852403736046464",
    },
    {
      date: "2024-10-02",
      instrument_name: "Instrument B",
      price: "0.439582701770696",
    },
    {
      date: "2024-10-03",
      instrument_name: "Instrument B",
      price: "0.4393337977115952",
    },
    {
      date: "2024-10-04",
      instrument_name: "Instrument B",
      price: "0.4356197005880611",
    },
    {
      date: "2024-10-07",
      instrument_name: "Instrument B",
      price: "0.4304569813371707",
    },
    {
      date: "2024-10-08",
      instrument_name: "Instrument B",
      price: "0.4371962260363542",
    },
    {
      date: "2024-10-09",
      instrument_name: "Instrument B",
      price: "0.4347711727837412",
    },
    {
      date: "2024-10-10",
      instrument_name: "Instrument B",
      price: "0.4309463796728229",
    },
    {
      date: "2024-10-11",
      instrument_name: "Instrument B",
      price: "0.43438577336329276",
    },
    {
      date: "2024-10-14",
      instrument_name: "Instrument B",
      price: "0.4385580999947686",
    },
    {
      date: "2024-10-15",
      instrument_name: "Instrument B",
      price: "0.4264284507376057",
    },
    {
      date: "2024-10-16",
      instrument_name: "Instrument B",
      price: "0.43213983078632734",
    },
    {
      date: "2024-10-17",
      instrument_name: "Instrument B",
      price: "0.4423017756953117",
    },
    {
      date: "2024-10-18",
      instrument_name: "Instrument B",
      price: "0.44853379372608626",
    },
    {
      date: "2024-10-21",
      instrument_name: "Instrument B",
      price: "0.4301966561001692",
    },
    {
      date: "2024-10-22",
      instrument_name: "Instrument B",
      price: "0.4245872503287037",
    },
    {
      date: "2024-10-23",
      instrument_name: "Instrument B",
      price: "0.4250127241334881",
    },
    {
      date: "2024-10-24",
      instrument_name: "Instrument B",
      price: "0.4240798006555826",
    },
    {
      date: "2024-10-25",
      instrument_name: "Instrument B",
      price: "0.42643490267357487",
    },
    {
      date: "2024-10-28",
      instrument_name: "Instrument B",
      price: "0.4176661731917215",
    },
    {
      date: "2024-10-29",
      instrument_name: "Instrument B",
      price: "0.4137881934066895",
    },
    {
      date: "2024-10-30",
      instrument_name: "Instrument B",
      price: "0.4050175905195603",
    },
    {
      date: "2024-10-31",
      instrument_name: "Instrument B",
      price: "0.397971180296384",
    },
    {
      date: "2024-11-01",
      instrument_name: "Instrument B",
      price: "0.39672764994355103",
    },
    {
      date: "2024-11-04",
      instrument_name: "Instrument B",
      price: "0.3968169200376087",
    },
    {
      date: "2024-11-05",
      instrument_name: "Instrument B",
      price: "0.39072229900083766",
    },
    {
      date: "2024-11-06",
      instrument_name: "Instrument B",
      price: "0.39068679447240745",
    },
    {
      date: "2024-11-07",
      instrument_name: "Instrument B",
      price: "0.39639490414205114",
    },
    {
      date: "2024-11-08",
      instrument_name: "Instrument B",
      price: "0.4062201309706871",
    },
    {
      date: "2024-11-11",
      instrument_name: "Instrument B",
      price: "0.4050651700209892",
    },
    {
      date: "2024-11-12",
      instrument_name: "Instrument B",
      price: "0.40299414991012716",
    },
    {
      date: "2024-11-13",
      instrument_name: "Instrument B",
      price: "0.4059518383619737",
    },
    {
      date: "2024-11-14",
      instrument_name: "Instrument B",
      price: "0.4041892746982514",
    },
    {
      date: "2024-11-15",
      instrument_name: "Instrument B",
      price: "0.4031896754590073",
    },
    {
      date: "2024-11-18",
      instrument_name: "Instrument B",
      price: "0.3991693412251093",
    },
    {
      date: "2024-11-19",
      instrument_name: "Instrument B",
      price: "0.38888412357774826",
    },
    {
      date: "2024-11-20",
      instrument_name: "Instrument B",
      price: "0.3914401159894336",
    },
    {
      date: "2024-11-21",
      instrument_name: "Instrument B",
      price: "0.403010788180887",
    },
    {
      date: "2024-11-22",
      instrument_name: "Instrument B",
      price: "0.40006238310166464",
    },
    {
      date: "2024-11-25",
      instrument_name: "Instrument B",
      price: "0.4120259657812704",
    },
    {
      date: "2024-11-26",
      instrument_name: "Instrument B",
      price: "0.4105161713341625",
    },
    {
      date: "2024-11-27",
      instrument_name: "Instrument B",
      price: "0.401311398062312",
    },
    {
      date: "2024-11-28",
      instrument_name: "Instrument B",
      price: "0.40245937081314886",
    },
    {
      date: "2024-11-29",
      instrument_name: "Instrument B",
      price: "0.4029143272630141",
    },
    {
      date: "2024-12-02",
      instrument_name: "Instrument B",
      price: "0.40067227599008026",
    },
    {
      date: "2024-12-03",
      instrument_name: "Instrument B",
      price: "0.40229289894719256",
    },
    {
      date: "2024-12-04",
      instrument_name: "Instrument B",
      price: "0.40370376049498513",
    },
    {
      date: "2024-12-05",
      instrument_name: "Instrument B",
      price: "0.4024271451940725",
    },
    {
      date: "2024-12-06",
      instrument_name: "Instrument B",
      price: "0.40416035236559533",
    },
    {
      date: "2024-12-09",
      instrument_name: "Instrument B",
      price: "0.4022435504442943",
    },
    {
      date: "2024-12-10",
      instrument_name: "Instrument B",
      price: "0.4024206544016352",
    },
    {
      date: "2024-12-11",
      instrument_name: "Instrument B",
      price: "0.39411377448764207",
    },
    {
      date: "2024-12-12",
      instrument_name: "Instrument B",
      price: "0.39207603513694944",
    },
    {
      date: "2024-12-13",
      instrument_name: "Instrument B",
      price: "0.39472529173919235",
    },
    {
      date: "2024-12-16",
      instrument_name: "Instrument B",
      price: "0.37536620626412975",
    },
    {
      date: "2024-12-17",
      instrument_name: "Instrument B",
      price: "0.36833764871806285",
    },
    {
      date: "2024-12-18",
      instrument_name: "Instrument B",
      price: "0.3626170889340864",
    },
    {
      date: "2024-12-19",
      instrument_name: "Instrument B",
      price: "0.36293765718453763",
    },
    {
      date: "2024-12-20",
      instrument_name: "Instrument B",
      price: "0.3644165152430942",
    },
    {
      date: "2024-01-01",
      instrument_name: "Instrument C",
      price: "0.7339241022444364",
    },
    {
      date: "2024-01-02",
      instrument_name: "Instrument C",
      price: "0.7311556275655702",
    },
    {
      date: "2024-01-03",
      instrument_name: "Instrument C",
      price: "0.7284046110593971",
    },
    {
      date: "2024-01-04",
      instrument_name: "Instrument C",
      price: "0.7311293320401703",
    },
    {
      date: "2024-01-05",
      instrument_name: "Instrument C",
      price: "0.7313379235101563",
    },
    {
      date: "2024-01-08",
      instrument_name: "Instrument C",
      price: "0.7433180449165283",
    },
    {
      date: "2024-01-09",
      instrument_name: "Instrument C",
      price: "0.7362338249009306",
    },
    {
      date: "2024-01-10",
      instrument_name: "Instrument C",
      price: "0.7379908674875538",
    },
    {
      date: "2024-01-11",
      instrument_name: "Instrument C",
      price: "0.7525848077615565",
    },
    {
      date: "2024-01-12",
      instrument_name: "Instrument C",
      price: "0.7531303277023781",
    },
    {
      date: "2024-01-15",
      instrument_name: "Instrument C",
      price: "0.7533132554778971",
    },
    {
      date: "2024-01-16",
      instrument_name: "Instrument C",
      price: "0.7562322435462172",
    },
    {
      date: "2024-01-17",
      instrument_name: "Instrument C",
      price: "0.7491529014109419",
    },
    {
      date: "2024-01-18",
      instrument_name: "Instrument C",
      price: "0.7481649755050684",
    },
    {
      date: "2024-01-19",
      instrument_name: "Instrument C",
      price: "0.735961978418152",
    },
    {
      date: "2024-01-22",
      instrument_name: "Instrument C",
      price: "0.7295313169683236",
    },
    {
      date: "2024-01-23",
      instrument_name: "Instrument C",
      price: "0.7203939065681891",
    },
    {
      date: "2024-01-24",
      instrument_name: "Instrument C",
      price: "0.7169768122514644",
    },
    {
      date: "2024-01-25",
      instrument_name: "Instrument C",
      price: "0.7209540257396381",
    },
    {
      date: "2024-01-26",
      instrument_name: "Instrument C",
      price: "0.7167168522179875",
    },
    {
      date: "2024-01-29",
      instrument_name: "Instrument C",
      price: "0.7029806708377918",
    },
    {
      date: "2024-01-30",
      instrument_name: "Instrument C",
      price: "0.701195735892998",
    },
    {
      date: "2024-01-31",
      instrument_name: "Instrument C",
      price: "0.6966908801962557",
    },
    {
      date: "2024-02-01",
      instrument_name: "Instrument C",
      price: "0.7057073561542265",
    },
    {
      date: "2024-02-02",
      instrument_name: "Instrument C",
      price: "0.6970614847105296",
    },
    {
      date: "2024-02-05",
      instrument_name: "Instrument C",
      price: "0.707626489704047",
    },
    {
      date: "2024-02-06",
      instrument_name: "Instrument C",
      price: "0.7038969998515953",
    },
    {
      date: "2024-02-07",
      instrument_name: "Instrument C",
      price: "0.6999583242878886",
    },
    {
      date: "2024-02-08",
      instrument_name: "Instrument C",
      price: "0.6951786670062962",
    },
    {
      date: "2024-02-09",
      instrument_name: "Instrument C",
      price: "0.697329449052085",
    },
    {
      date: "2024-02-12",
      instrument_name: "Instrument C",
      price: "0.6786070063366161",
    },
    {
      date: "2024-02-13",
      instrument_name: "Instrument C",
      price: "0.6791191424278956",
    },
    {
      date: "2024-02-14",
      instrument_name: "Instrument C",
      price: "0.6825093476931272",
    },
    {
      date: "2024-02-15",
      instrument_name: "Instrument C",
      price: "0.6752812443921611",
    },
    {
      date: "2024-02-16",
      instrument_name: "Instrument C",
      price: "0.6778194496363255",
    },
    {
      date: "2024-02-19",
      instrument_name: "Instrument C",
      price: "0.6792259537613928",
    },
    {
      date: "2024-02-20",
      instrument_name: "Instrument C",
      price: "0.6924503755155772",
    },
    {
      date: "2024-02-21",
      instrument_name: "Instrument C",
      price: "0.6796409569795216",
    },
    {
      date: "2024-02-22",
      instrument_name: "Instrument C",
      price: "0.6771379302119117",
    },
    {
      date: "2024-02-23",
      instrument_name: "Instrument C",
      price: "0.6677895738943677",
    },
    {
      date: "2024-02-26",
      instrument_name: "Instrument C",
      price: "0.6723113911294029",
    },
    {
      date: "2024-02-27",
      instrument_name: "Instrument C",
      price: "0.6736720738553996",
    },
    {
      date: "2024-02-28",
      instrument_name: "Instrument C",
      price: "0.6727925401593339",
    },
    {
      date: "2024-02-29",
      instrument_name: "Instrument C",
      price: "0.6689682246128978",
    },
    {
      date: "2024-03-01",
      instrument_name: "Instrument C",
      price: "0.6618294805953233",
    },
    {
      date: "2024-03-04",
      instrument_name: "Instrument C",
      price: "0.6654765786591585",
    },
    {
      date: "2024-03-05",
      instrument_name: "Instrument C",
      price: "0.6741847051462618",
    },
    {
      date: "2024-03-06",
      instrument_name: "Instrument C",
      price: "0.6624603528597626",
    },
    {
      date: "2024-03-07",
      instrument_name: "Instrument C",
      price: "0.6612662591085697",
    },
    {
      date: "2024-03-08",
      instrument_name: "Instrument C",
      price: "0.6663694405232475",
    },
    {
      date: "2024-03-11",
      instrument_name: "Instrument C",
      price: "0.6450342449650492",
    },
    {
      date: "2024-03-12",
      instrument_name: "Instrument C",
      price: "0.6458215864490066",
    },
    {
      date: "2024-03-13",
      instrument_name: "Instrument C",
      price: "0.646427065158994",
    },
    {
      date: "2024-03-14",
      instrument_name: "Instrument C",
      price: "0.6489341558862697",
    },
    {
      date: "2024-03-15",
      instrument_name: "Instrument C",
      price: "0.6441736034040995",
    },
    {
      date: "2024-03-18",
      instrument_name: "Instrument C",
      price: "0.6394769697141448",
    },
    {
      date: "2024-03-19",
      instrument_name: "Instrument C",
      price: "0.6388875229352332",
    },
    {
      date: "2024-03-20",
      instrument_name: "Instrument C",
      price: "0.6339277150699894",
    },
    {
      date: "2024-03-21",
      instrument_name: "Instrument C",
      price: "0.6408631254593734",
    },
    {
      date: "2024-03-22",
      instrument_name: "Instrument C",
      price: "0.6314794379441322",
    },
    {
      date: "2024-03-25",
      instrument_name: "Instrument C",
      price: "0.6331612920934513",
    },
    {
      date: "2024-03-26",
      instrument_name: "Instrument C",
      price: "0.6352977743671241",
    },
    {
      date: "2024-03-27",
      instrument_name: "Instrument C",
      price: "0.6311957147258428",
    },
    {
      date: "2024-03-28",
      instrument_name: "Instrument C",
      price: "0.6289416305148116",
    },
    {
      date: "2024-03-29",
      instrument_name: "Instrument C",
      price: "0.6373924096202849",
    },
    {
      date: "2024-04-01",
      instrument_name: "Instrument C",
      price: "0.6227273016195131",
    },
    {
      date: "2024-04-02",
      instrument_name: "Instrument C",
      price: "0.6234399956921228",
    },
    {
      date: "2024-04-03",
      instrument_name: "Instrument C",
      price: "0.6259146607946428",
    },
    {
      date: "2024-04-04",
      instrument_name: "Instrument C",
      price: "0.6284222818345732",
    },
    {
      date: "2024-04-05",
      instrument_name: "Instrument C",
      price: "0.6364203023238129",
    },
    {
      date: "2024-04-08",
      instrument_name: "Instrument C",
      price: "0.6225600922751489",
    },
    {
      date: "2024-04-09",
      instrument_name: "Instrument C",
      price: "0.6161764570021473",
    },
    {
      date: "2024-04-10",
      instrument_name: "Instrument C",
      price: "0.6080380093714212",
    },
    {
      date: "2024-04-11",
      instrument_name: "Instrument C",
      price: "0.6165117243684182",
    },
    {
      date: "2024-04-12",
      instrument_name: "Instrument C",
      price: "0.6075565059456673",
    },
    {
      date: "2024-04-15",
      instrument_name: "Instrument C",
      price: "0.6094824684204855",
    },
    {
      date: "2024-04-16",
      instrument_name: "Instrument C",
      price: "0.5992829453646438",
    },
    {
      date: "2024-04-17",
      instrument_name: "Instrument C",
      price: "0.6005048133577456",
    },
    {
      date: "2024-04-18",
      instrument_name: "Instrument C",
      price: "0.595197420302016",
    },
    {
      date: "2024-04-19",
      instrument_name: "Instrument C",
      price: "0.5974799686005489",
    },
    {
      date: "2024-04-22",
      instrument_name: "Instrument C",
      price: "0.5937360878659241",
    },
    {
      date: "2024-04-23",
      instrument_name: "Instrument C",
      price: "0.5805706815720452",
    },
    {
      date: "2024-04-24",
      instrument_name: "Instrument C",
      price: "0.5757709275589094",
    },
    {
      date: "2024-04-25",
      instrument_name: "Instrument C",
      price: "0.5736089192416356",
    },
    {
      date: "2024-04-26",
      instrument_name: "Instrument C",
      price: "0.5781651808430178",
    },
    {
      date: "2024-04-29",
      instrument_name: "Instrument C",
      price: "0.5679162422798797",
    },
    {
      date: "2024-04-30",
      instrument_name: "Instrument C",
      price: "0.5601846089256394",
    },
    {
      date: "2024-05-01",
      instrument_name: "Instrument C",
      price: "0.5584341839542516",
    },
    {
      date: "2024-05-02",
      instrument_name: "Instrument C",
      price: "0.5567854202724772",
    },
    {
      date: "2024-05-03",
      instrument_name: "Instrument C",
      price: "0.5570178101897627",
    },
    {
      date: "2024-05-06",
      instrument_name: "Instrument C",
      price: "0.5477415461199504",
    },
    {
      date: "2024-05-07",
      instrument_name: "Instrument C",
      price: "0.5424060590896721",
    },
    {
      date: "2024-05-08",
      instrument_name: "Instrument C",
      price: "0.5347507053746469",
    },
    {
      date: "2024-05-09",
      instrument_name: "Instrument C",
      price: "0.5400341975494759",
    },
    {
      date: "2024-05-10",
      instrument_name: "Instrument C",
      price: "0.5416191666919424",
    },
    {
      date: "2024-05-13",
      instrument_name: "Instrument C",
      price: "0.5454692753754083",
    },
    {
      date: "2024-05-14",
      instrument_name: "Instrument C",
      price: "0.545095613811279",
    },
    {
      date: "2024-05-15",
      instrument_name: "Instrument C",
      price: "0.5391619647732585",
    },
    {
      date: "2024-05-16",
      instrument_name: "Instrument C",
      price: "0.5300484090252378",
    },
    {
      date: "2024-05-17",
      instrument_name: "Instrument C",
      price: "0.5269569042954585",
    },
    {
      date: "2024-05-20",
      instrument_name: "Instrument C",
      price: "0.5237181382763098",
    },
    {
      date: "2024-05-21",
      instrument_name: "Instrument C",
      price: "0.5204509226358167",
    },
    {
      date: "2024-05-22",
      instrument_name: "Instrument C",
      price: "0.5188810819446775",
    },
    {
      date: "2024-05-23",
      instrument_name: "Instrument C",
      price: "0.5095800119103939",
    },
    {
      date: "2024-05-24",
      instrument_name: "Instrument C",
      price: "0.5122903659722077",
    },
    {
      date: "2024-05-27",
      instrument_name: "Instrument C",
      price: "0.49439132527426033",
    },
    {
      date: "2024-05-28",
      instrument_name: "Instrument C",
      price: "0.49903913723443905",
    },
    {
      date: "2024-05-29",
      instrument_name: "Instrument C",
      price: "0.4962795643092811",
    },
    {
      date: "2024-05-30",
      instrument_name: "Instrument C",
      price: "0.5013758166896338",
    },
    {
      date: "2024-05-31",
      instrument_name: "Instrument C",
      price: "0.5083810863247181",
    },
    {
      date: "2024-06-03",
      instrument_name: "Instrument C",
      price: "0.49577041006478584",
    },
    {
      date: "2024-06-04",
      instrument_name: "Instrument C",
      price: "0.49647988382303065",
    },
    {
      date: "2024-06-05",
      instrument_name: "Instrument C",
      price: "0.5060822579074941",
    },
    {
      date: "2024-06-06",
      instrument_name: "Instrument C",
      price: "0.5050497997521955",
    },
    {
      date: "2024-06-07",
      instrument_name: "Instrument C",
      price: "0.49424521439377045",
    },
    {
      date: "2024-06-10",
      instrument_name: "Instrument C",
      price: "0.4818956894073989",
    },
    {
      date: "2024-06-11",
      instrument_name: "Instrument C",
      price: "0.4682204118030701",
    },
    {
      date: "2024-06-12",
      instrument_name: "Instrument C",
      price: "0.4668756501875652",
    },
    {
      date: "2024-06-13",
      instrument_name: "Instrument C",
      price: "0.4620957611913478",
    },
    {
      date: "2024-06-14",
      instrument_name: "Instrument C",
      price: "0.47010371173141813",
    },
    {
      date: "2024-06-17",
      instrument_name: "Instrument C",
      price: "0.4697948196450559",
    },
    {
      date: "2024-06-18",
      instrument_name: "Instrument C",
      price: "0.4694079783964959",
    },
    {
      date: "2024-06-19",
      instrument_name: "Instrument C",
      price: "0.4602909741902559",
    },
    {
      date: "2024-06-20",
      instrument_name: "Instrument C",
      price: "0.45423463489972016",
    },
    {
      date: "2024-06-21",
      instrument_name: "Instrument C",
      price: "0.45882220064188767",
    },
    {
      date: "2024-06-24",
      instrument_name: "Instrument C",
      price: "0.4577413088151676",
    },
    {
      date: "2024-06-25",
      instrument_name: "Instrument C",
      price: "0.4594151105999413",
    },
    {
      date: "2024-06-26",
      instrument_name: "Instrument C",
      price: "0.46851407600023304",
    },
    {
      date: "2024-06-27",
      instrument_name: "Instrument C",
      price: "0.46847389995523164",
    },
    {
      date: "2024-06-28",
      instrument_name: "Instrument C",
      price: "0.4623058543132509",
    },
    {
      date: "2024-07-01",
      instrument_name: "Instrument C",
      price: "0.4671769717981351",
    },
    {
      date: "2024-07-02",
      instrument_name: "Instrument C",
      price: "0.45824630467306643",
    },
    {
      date: "2024-07-03",
      instrument_name: "Instrument C",
      price: "0.4586593305060962",
    },
    {
      date: "2024-07-04",
      instrument_name: "Instrument C",
      price: "0.45331754810417635",
    },
    {
      date: "2024-07-05",
      instrument_name: "Instrument C",
      price: "0.44962888071664986",
    },
    {
      date: "2024-07-08",
      instrument_name: "Instrument C",
      price: "0.45163203593575074",
    },
    {
      date: "2024-07-09",
      instrument_name: "Instrument C",
      price: "0.4499873180661211",
    },
    {
      date: "2024-07-10",
      instrument_name: "Instrument C",
      price: "0.4464514013260875",
    },
    {
      date: "2024-07-11",
      instrument_name: "Instrument C",
      price: "0.4600544085114421",
    },
    {
      date: "2024-07-12",
      instrument_name: "Instrument C",
      price: "0.4605906915792396",
    },
    {
      date: "2024-07-15",
      instrument_name: "Instrument C",
      price: "0.46722490288910995",
    },
    {
      date: "2024-07-16",
      instrument_name: "Instrument C",
      price: "0.4753277486772983",
    },
    {
      date: "2024-07-17",
      instrument_name: "Instrument C",
      price: "0.48491220932541956",
    },
    {
      date: "2024-07-18",
      instrument_name: "Instrument C",
      price: "0.48759527597532093",
    },
    {
      date: "2024-07-19",
      instrument_name: "Instrument C",
      price: "0.48499050949200095",
    },
    {
      date: "2024-07-22",
      instrument_name: "Instrument C",
      price: "0.4779317490167635",
    },
    {
      date: "2024-07-23",
      instrument_name: "Instrument C",
      price: "0.48327592528877716",
    },
    {
      date: "2024-07-24",
      instrument_name: "Instrument C",
      price: "0.4824240220590277",
    },
    {
      date: "2024-07-25",
      instrument_name: "Instrument C",
      price: "0.48642562361867936",
    },
    {
      date: "2024-07-26",
      instrument_name: "Instrument C",
      price: "0.48895269862815494",
    },
    {
      date: "2024-07-29",
      instrument_name: "Instrument C",
      price: "0.4661237023365198",
    },
    {
      date: "2024-07-30",
      instrument_name: "Instrument C",
      price: "0.46313466273343656",
    },
    {
      date: "2024-07-31",
      instrument_name: "Instrument C",
      price: "0.4629507954703467",
    },
    {
      date: "2024-08-01",
      instrument_name: "Instrument C",
      price: "0.45885378606919547",
    },
    {
      date: "2024-08-02",
      instrument_name: "Instrument C",
      price: "0.4615136040384717",
    },
    {
      date: "2024-08-05",
      instrument_name: "Instrument C",
      price: "0.4581813503673282",
    },
    {
      date: "2024-08-06",
      instrument_name: "Instrument C",
      price: "0.4659980080618359",
    },
    {
      date: "2024-08-07",
      instrument_name: "Instrument C",
      price: "0.46026629567190525",
    },
    {
      date: "2024-08-08",
      instrument_name: "Instrument C",
      price: "0.4704528833632495",
    },
    {
      date: "2024-08-09",
      instrument_name: "Instrument C",
      price: "0.46662562633512217",
    },
    {
      date: "2024-08-12",
      instrument_name: "Instrument C",
      price: "0.47247493938108165",
    },
    {
      date: "2024-08-13",
      instrument_name: "Instrument C",
      price: "0.4760954577917455",
    },
    {
      date: "2024-08-14",
      instrument_name: "Instrument C",
      price: "0.47825477054452253",
    },
    {
      date: "2024-08-15",
      instrument_name: "Instrument C",
      price: "0.4813751970883009",
    },
    {
      date: "2024-08-16",
      instrument_name: "Instrument C",
      price: "0.47667172200136004",
    },
    {
      date: "2024-08-19",
      instrument_name: "Instrument C",
      price: "0.48479326583470916",
    },
    {
      date: "2024-08-20",
      instrument_name: "Instrument C",
      price: "0.48339431948734657",
    },
    {
      date: "2024-08-21",
      instrument_name: "Instrument C",
      price: "0.4806474290000302",
    },
    {
      date: "2024-08-22",
      instrument_name: "Instrument C",
      price: "0.4739679242487553",
    },
    {
      date: "2024-08-23",
      instrument_name: "Instrument C",
      price: "0.4738124889187041",
    },
    {
      date: "2024-08-26",
      instrument_name: "Instrument C",
      price: "0.46896860187261075",
    },
    {
      date: "2024-08-27",
      instrument_name: "Instrument C",
      price: "0.46927899172715576",
    },
    {
      date: "2024-08-28",
      instrument_name: "Instrument C",
      price: "0.4734907127621453",
    },
    {
      date: "2024-08-29",
      instrument_name: "Instrument C",
      price: "0.4786970455872256",
    },
    {
      date: "2024-08-30",
      instrument_name: "Instrument C",
      price: "0.4783129342908677",
    },
    {
      date: "2024-09-02",
      instrument_name: "Instrument C",
      price: "0.47522211698959166",
    },
    {
      date: "2024-09-03",
      instrument_name: "Instrument C",
      price: "0.4751940561907752",
    },
    {
      date: "2024-09-04",
      instrument_name: "Instrument C",
      price: "0.4830693173241012",
    },
    {
      date: "2024-09-05",
      instrument_name: "Instrument C",
      price: "0.484706833652108",
    },
    {
      date: "2024-09-06",
      instrument_name: "Instrument C",
      price: "0.48762000407357087",
    },
    {
      date: "2024-09-09",
      instrument_name: "Instrument C",
      price: "0.48516615853998923",
    },
    {
      date: "2024-09-10",
      instrument_name: "Instrument C",
      price: "0.4781256562687496",
    },
    {
      date: "2024-09-11",
      instrument_name: "Instrument C",
      price: "0.475845586764933",
    },
    {
      date: "2024-09-12",
      instrument_name: "Instrument C",
      price: "0.478190927181119",
    },
    {
      date: "2024-09-13",
      instrument_name: "Instrument C",
      price: "0.47220874996402745",
    },
    {
      date: "2024-09-16",
      instrument_name: "Instrument C",
      price: "0.47066366748585664",
    },
    {
      date: "2024-09-17",
      instrument_name: "Instrument C",
      price: "0.4664859738109006",
    },
    {
      date: "2024-09-18",
      instrument_name: "Instrument C",
      price: "0.46049487892537744",
    },
    {
      date: "2024-09-19",
      instrument_name: "Instrument C",
      price: "0.4524625915809928",
    },
    {
      date: "2024-09-20",
      instrument_name: "Instrument C",
      price: "0.4487103146523752",
    },
    {
      date: "2024-09-23",
      instrument_name: "Instrument C",
      price: "0.43936117175542716",
    },
    {
      date: "2024-09-24",
      instrument_name: "Instrument C",
      price: "0.4375621059922987",
    },
    {
      date: "2024-09-25",
      instrument_name: "Instrument C",
      price: "0.43081900514833626",
    },
    {
      date: "2024-09-26",
      instrument_name: "Instrument C",
      price: "0.43109481396675103",
    },
    {
      date: "2024-09-27",
      instrument_name: "Instrument C",
      price: "0.4309287850816963",
    },
    {
      date: "2024-09-30",
      instrument_name: "Instrument C",
      price: "0.44362690732990334",
    },
    {
      date: "2024-10-01",
      instrument_name: "Instrument C",
      price: "0.4472967323072718",
    },
    {
      date: "2024-10-02",
      instrument_name: "Instrument C",
      price: "0.4457693192019422",
    },
    {
      date: "2024-10-03",
      instrument_name: "Instrument C",
      price: "0.4445367455329819",
    },
    {
      date: "2024-10-04",
      instrument_name: "Instrument C",
      price: "0.45197593928571045",
    },
    {
      date: "2024-10-07",
      instrument_name: "Instrument C",
      price: "0.4455172910456072",
    },
    {
      date: "2024-10-08",
      instrument_name: "Instrument C",
      price: "0.4432043361749112",
    },
    {
      date: "2024-10-09",
      instrument_name: "Instrument C",
      price: "0.43958434874201335",
    },
    {
      date: "2024-10-10",
      instrument_name: "Instrument C",
      price: "0.439497211080405",
    },
    {
      date: "2024-10-11",
      instrument_name: "Instrument C",
      price: "0.4384240559834524",
    },
    {
      date: "2024-10-14",
      instrument_name: "Instrument C",
      price: "0.4207440797686918",
    },
    {
      date: "2024-10-15",
      instrument_name: "Instrument C",
      price: "0.4162695532825042",
    },
    {
      date: "2024-10-16",
      instrument_name: "Instrument C",
      price: "0.41285256978677004",
    },
    {
      date: "2024-10-17",
      instrument_name: "Instrument C",
      price: "0.412753217383175",
    },
    {
      date: "2024-10-18",
      instrument_name: "Instrument C",
      price: "0.42171313904215324",
    },
    {
      date: "2024-10-21",
      instrument_name: "Instrument C",
      price: "0.40737570005604695",
    },
    {
      date: "2024-10-22",
      instrument_name: "Instrument C",
      price: "0.40728691612962825",
    },
    {
      date: "2024-10-23",
      instrument_name: "Instrument C",
      price: "0.40937458566418033",
    },
    {
      date: "2024-10-24",
      instrument_name: "Instrument C",
      price: "0.4121608039650988",
    },
    {
      date: "2024-10-25",
      instrument_name: "Instrument C",
      price: "0.41544383619184083",
    },
    {
      date: "2024-10-28",
      instrument_name: "Instrument C",
      price: "0.4265947485679531",
    },
    {
      date: "2024-10-29",
      instrument_name: "Instrument C",
      price: "0.42396539819773",
    },
    {
      date: "2024-10-30",
      instrument_name: "Instrument C",
      price: "0.42365659331500527",
    },
    {
      date: "2024-10-31",
      instrument_name: "Instrument C",
      price: "0.42928022090943946",
    },
    {
      date: "2024-11-01",
      instrument_name: "Instrument C",
      price: "0.431256838284949",
    },
    {
      date: "2024-11-04",
      instrument_name: "Instrument C",
      price: "0.4218240842034642",
    },
    {
      date: "2024-11-05",
      instrument_name: "Instrument C",
      price: "0.4142512250413871",
    },
    {
      date: "2024-11-06",
      instrument_name: "Instrument C",
      price: "0.41714918125260275",
    },
    {
      date: "2024-11-07",
      instrument_name: "Instrument C",
      price: "0.4182444431882407",
    },
    {
      date: "2024-11-08",
      instrument_name: "Instrument C",
      price: "0.4233085378430683",
    },
    {
      date: "2024-11-11",
      instrument_name: "Instrument C",
      price: "0.42305986625303765",
    },
    {
      date: "2024-11-12",
      instrument_name: "Instrument C",
      price: "0.43103461000886983",
    },
    {
      date: "2024-11-13",
      instrument_name: "Instrument C",
      price: "0.4441093519335072",
    },
    {
      date: "2024-11-14",
      instrument_name: "Instrument C",
      price: "0.45094549636434067",
    },
    {
      date: "2024-11-15",
      instrument_name: "Instrument C",
      price: "0.4524925819904525",
    },
    {
      date: "2024-11-18",
      instrument_name: "Instrument C",
      price: "0.46000874031820055",
    },
    {
      date: "2024-11-19",
      instrument_name: "Instrument C",
      price: "0.4589568660190134",
    },
    {
      date: "2024-11-20",
      instrument_name: "Instrument C",
      price: "0.46190971918605916",
    },
    {
      date: "2024-11-21",
      instrument_name: "Instrument C",
      price: "0.46518398219973023",
    },
    {
      date: "2024-11-22",
      instrument_name: "Instrument C",
      price: "0.45870214998626263",
    },
    {
      date: "2024-11-25",
      instrument_name: "Instrument C",
      price: "0.45163413409690817",
    },
    {
      date: "2024-11-26",
      instrument_name: "Instrument C",
      price: "0.4540914390818785",
    },
    {
      date: "2024-11-27",
      instrument_name: "Instrument C",
      price: "0.45394245693797325",
    },
    {
      date: "2024-11-28",
      instrument_name: "Instrument C",
      price: "0.44891480550595575",
    },
    {
      date: "2024-11-29",
      instrument_name: "Instrument C",
      price: "0.456744012456623",
    },
    {
      date: "2024-12-02",
      instrument_name: "Instrument C",
      price: "0.4590230189956406",
    },
    {
      date: "2024-12-03",
      instrument_name: "Instrument C",
      price: "0.46456917275056997",
    },
    {
      date: "2024-12-04",
      instrument_name: "Instrument C",
      price: "0.4614914985215261",
    },
    {
      date: "2024-12-05",
      instrument_name: "Instrument C",
      price: "0.4599227197666508",
    },
    {
      date: "2024-12-06",
      instrument_name: "Instrument C",
      price: "0.45934242478862675",
    },
    {
      date: "2024-12-09",
      instrument_name: "Instrument C",
      price: "0.4634156522401629",
    },
    {
      date: "2024-12-10",
      instrument_name: "Instrument C",
      price: "0.45607597523989374",
    },
    {
      date: "2024-12-11",
      instrument_name: "Instrument C",
      price: "0.451934408934409",
    },
    {
      date: "2024-12-12",
      instrument_name: "Instrument C",
      price: "0.44725017457644844",
    },
    {
      date: "2024-12-13",
      instrument_name: "Instrument C",
      price: "0.44592257550133896",
    },
    {
      date: "2024-12-16",
      instrument_name: "Instrument C",
      price: "0.4467086092999672",
    },
    {
      date: "2024-12-17",
      instrument_name: "Instrument C",
      price: "0.4473675179191344",
    },
    {
      date: "2024-12-18",
      instrument_name: "Instrument C",
      price: "0.44850425038226516",
    },
    {
      date: "2024-12-19",
      instrument_name: "Instrument C",
      price: "0.44887576292386494",
    },
    {
      date: "2024-12-20",
      instrument_name: "Instrument C",
      price: "0.4515368204667236",
    },
  ].map((item) => ({
    ...item,
    instrument_name: item.instrument_name,
    price: Number((Number(item.price) * 15000000).toFixed(2)),
  }))
);
