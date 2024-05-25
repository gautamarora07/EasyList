import React, { useState } from "react";
import "./Main.css";
import {  PDFDownloadLink,Document,Page, Text,View,StyleSheet,} from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa6";
import { VscChecklist } from "react-icons/vsc";
import { BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Subjects_data from "./data/Subjects.json";


const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flexStart",
    border: "5px solid white",
  },
  heading: { fontSize: 18, marginBottom: 10, fontFamily: "Helvetica-Bold" },
  sub_header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Helvetica-Bold",
  },
  subheading: { fontSize: 14, marginVertical: 8, marginHorizontal: 16 },
  table_header: { flexDirection: "row" },
  table_header_cell: {
    fontSize: 12,
    margin: 0,
    padding: 5,
    textAlign: "center",
    width: 160,
    border: "2px solid #fff",
    fontFamily: "Helvetica-Bold",
  },
  table: { flexDirection: "row" },
  cell: {
    fontSize: 11,
    padding: 5,
    textAlign: "center",
    width: 160,
    fontFamily: "Helvetica",
    marginVertical: 1,
  },
  name_cell: {
    fontSize: 11,
    padding: 5,
    textAlign: "center",
    width: 180,
    fontFamily: "Helvetica",
    marginVertical: 1,
  },
});

let section = "";
let downloadDateTime = "";
let total; let count=0;
let subjects = [];
let selectedSubject = '';
const Main4 = () => {
  const [checkedArr, setCheckedArr] = useState([]);
  const [data, setData] = useState([]);
  const [heading, setHeading] = useState("ATTENDANCE");
  const [customHeading, setCustomHeading] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [hide, setHide] = useState(false)
  const [active2, setActive2] = useState(false)
  //--------------------------------------------------------------------------------------------------------------------
  const GeneratePDF = ({ data }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>
          {showTextInput ? customHeading : heading}
        </Text>

        {!showTextInput && (
          <View style={styles.sub_header}>
            <Text style={styles.subheading}>SUBJECT : {selectedSubject}</Text>
          </View>
        )}
        <View style={styles.sub_header}>
          <Text style={styles.subheading}>SECTION : {section}</Text>
          <Text style={styles.subheading}>TOTAL STUDENTS : {total}</Text>
        </View>
        <View style={styles.sub_header}>
          <Text style={styles.subheading}>
            DATE & TIME : {downloadDateTime}
          </Text>
        </View>

        <View style={styles.sub_header}>
          <Text style={styles.subheading}></Text>
        </View>

        <View style={styles.table_header}>
          <Text style={styles.table_header_cell}>CLASS ROLL NO.</Text>
          <Text style={styles.table_header_cell}>NAME</Text>
          <Text style={styles.table_header_cell}>UNIVERSITY ROLL NO.</Text>
        </View>

        {data.map(({ c_roll, name, u_roll }) => (
          <View key={c_roll} style={styles.table}>
            <Text style={styles.cell}>{c_roll}</Text>
            <Text style={styles.name_cell}>{name}</Text>
            <Text style={styles.cell}>{u_roll}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
  //--------------------------------------------------------------------------------------------------------------------
  const handleSelectChange = (e) => {
    downloadDateTime = new Date().toLocaleString();
    setCheckedArr([]);
    const selectedOption = e.target.value;
    section = selectedOption;
    import(`./data/${selectedOption}.json`)
      .then((jsonModule) => setData(jsonModule.default))
      .catch((error) => console.error("Error loading JSON:", error));

      const selectedSection = Subjects_data.find(item => item.section === section);
      subjects = selectedSection ? selectedSection.subjects : []
  };


  const handleSubject = (e) => {
     selectedSubject = e.target.value;
  }
  const handleCheckboxClick = (id) => {
    const index = checkedArr.findIndex((item) => item.id === id);
    if (index === -1) {
      const selectedData = data.find((item) => item.id === id);
      setCheckedArr([...checkedArr, selectedData]);
      
    } else {
      const newArr = [...checkedArr];
      newArr.splice(index, 1);
      setCheckedArr(newArr);
      
    }
  };

  const handleButtonClick = () => {
    console.table(checkedArr);
    toast.success("PDF will be downloaded on your device.", {
      position: "top-center",
      autoClose: 3500,
    });
  };

  const handleSelectAllClick = () => {
    if (checkedArr.length === data.length) {
      setCheckedArr([]);
    } else {
      const details = data.map(({ id, name, c_roll, u_roll }) => ({
        id,
        name,
        c_roll,
        u_roll,
      }));
      setCheckedArr(details);

    }
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setHeading(value);
    if (value === "OTHER") {
      setShowTextInput(true);
    } else {
      setShowTextInput(false);
    }
  };

  const handleTextInputChange = (e) => {
    const text = e.target.value.toUpperCase();
    setCustomHeading(text);
  };

  function sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  const sortedArr = sortByKey(checkedArr, "c_roll");
  total = Object.keys(sortedArr).length;
  let data_length = Object.keys(data).length;
            count = Object.keys(checkedArr).length;


  return (
    <>
      
      <div className="head-container">
{/* ---------------------------------------------------------------------------------------------------------------------------*/}
      <div className="section-options">
        <select onChange={handleSelectChange}>
          <option value="">Select Section</option>
          <option value="AI1">AI (1)</option>
          <option value="AI2">AI (2)</option>
          <option value="AI3">AI (3)</option>
        </select>
      </div>
{/* ---------------------------------------------------------------------------------------------------------------------------*/}
        <div className="head-options">
          <div className="head-option1">
            <input
              type="radio"
              id="attendance"
              value="ATTENDANCE"
              checked={heading === "ATTENDANCE"}
              onChange={handleRadioChange}
            />
            <label htmlFor="attendance">ATTENDANCE</label>
          </div>

          <div className="head-option2">
            <input
              type="radio"
              id="other"
              value="OTHER"
              checked={heading === "OTHER"}
              onChange={handleRadioChange}
              />
            <label htmlFor="other">OTHER</label>
          </div>
        </div>

{/* ---------------------------------------------------------------------------------------------------------------------------*/}

        {showTextInput ? (
          <div className="head-custom ">
            
            <input
              type="text"
              id="customHeading"
              value={customHeading}
              onChange={handleTextInputChange}
              placeholder="Enter custom heading ..."
              required
            />
          </div>
        ) : (
            <div className="head-subject">
              <select onChange={handleSubject} required> 
                <option value="">Select Subject</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
        )}
    </div>
      {/*--------------------------------------------------------------------------------------------------------------------------- */}
      {data_length !== 0 && (
        <div className="main-container ">
          <div className="selectAll-container">
           
            <div className="selectAll-div"   >  
              <label htmlFor="selectAll">
                <input type="checkbox" id="selectAll" checked={checkedArr.length === data.length} onChange={handleSelectAllClick} />
                <span ><VscChecklist /></span>
              </label>
            </div>
          
            <div className={active2 ? "hideNames-div active-btn" : "hideNames-div"} onClick={()=>{setHide(!hide); setActive2(!active2)}}>
                <span><BiHide /></span>
            </div>
          
          </div>

          {/* ------------------------------------------------------------------------------------------------------------------- */}

          <div className={hide ? "data-container hide-data " : "data-container"} >
            {data.map(({ id, name, c_roll }) => (
              <div key={id} className={hide ? "checkbox hide-checkbox":"checkbox"} onClick={() => handleCheckboxClick(id)} >
                <input
                  type="checkbox"
                  checked={checkedArr.some((item) => item.id === id)}
                  onChange={() => {}}
                />

                <div className={hide ? "cb-text hide-cb-text sedan-regular" : "cb-text sedan-regular"}>
                  
                  <b> ({c_roll}) </b> <span className={hide ? 'hide-class' : ''}>{name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ------------------------------------------------------------------------------------ */}
          {total !== 0 && (
            <div className="print-container">
              <PDFDownloadLink
                document={<GeneratePDF data={sortedArr} />}
                fileName={showTextInput ? `${customHeading}_${section}.pdf` : `${selectedSubject}_${section}.pdf`}
                className="PDF">

                <button className="print-btn" onClick={handleButtonClick}>
                  <FaFilePdf id="PDF-icon" />
                </button>

              </PDFDownloadLink>

              <div className="count sedan-regular">
                Total Students : {count}
              </div>
            </div>
          )}
          {/* ---------------------------------------------------------------------------------------------------------------------------------- */}
        </div>
      )}
    </>
  );
};

export default Main4;
