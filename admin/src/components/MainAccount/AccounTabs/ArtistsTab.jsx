import React, { useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
import { axiosinstance } from '../../../utils/axiosinstance';
import {
  category_options,
  export_options,
  subcategory_options,
} from '../../Options';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { write, writeFile, utils } from 'xlsx';
import { toast } from 'react-toastify';

export default function ArtistsTab() {
  const [Artists, setArtists] = useState();
  const [Filteredartists, setFilteredartists] = useState();
  const [filters, setfilters] = useState();
  const [exportto, setexportto] = useState();
  const subcategory_ref = useRef();

  const ExportData = () => {
    if (exportto) {
      const columns = [
        {
          title: 'SNO',
          feild: 'sno',
        },
        {
          title: 'Name',
          feild: 'name',
        },
        {
          title: 'Surname',
          feild: 'surname',
        },
        {
          title: 'Category',
          feild: 'category',
        },
        {
          title: 'Sub Category',
          feild: 'subcategory',
        },
        {
          title: 'Location',
          feild: 'location',
        },
      ];
      if (exportto === 'PDF') {
        const doc = new jsPDF();
        doc.text('All Artists', 20, 10);
        autoTable(doc, {
          columns: columns.map((col) => ({ ...col, dataKey: col.feild })),
          body:
            Filteredartists?.length > 0
              ? Filteredartists?.map((item, index) => ({
                  ...item,
                  sno: index + 1,
                }))
              : Artists?.map((item, index) => ({
                  ...item,
                  sno: index + 1,
                })),
        });
        doc.save('Artists.pdf');
      } else {
        const worksheet = utils.json_to_sheet(
          Filteredartists?.length > 0
            ? Filteredartists?.map((item, index) => ({
                sno: index + 1,
                name: item.name + ' ' + item.surname,
                category: item.category,
                subcategory: item.subcategory,
                location: item.state + ', ' + item?.city,
              }))
            : Artists?.map((item, index) => ({
                sno: index + 1,
                name: item.name + ' ' + item.surname,
                category: item.category,
                subcategory: item.subcategory,
                location: item.state + ', ' + item?.city,
              }))
        );
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Artists');
        write(workbook, { bookType: 'xlsx', type: 'buffer' });
        write(workbook, { bookType: 'xlsx', type: 'binary' });
        writeFile(workbook, 'Artists.xlsx');
      }
    } else {
      toast.error('Please select where you want to export');
    }
  };

  useEffect(() => {
    const FilterItems = () => {
      const filtereditems = Artists?.filter((item) =>
        Object.entries(filters).every(([key, value]) => item[key] === value)
      );
      setFilteredartists(filtereditems);
    };
    FilterItems();
  }, [filters]);

  useEffect(() => {
    const GetAllartists = async () => {
      try {
        const res = await axiosinstance.get('/user/all');
        setArtists(
          res.data.map((item) => ({
            ...item,
            location: item?.state + ', ' + item?.city,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };
    GetAllartists();
  }, []);

  useMemo(() => {
    subcategory_ref.current?.setValue(null);
    delete filters?.subcategory;
  }, [filters?.category]);

  return (
    <div className="main_artists_tab">
      <div className="artists_tab_heading">
        <div className="heading_inner_artists_tab">
          <h2>Total Registered Artists</h2>
          <p>All Registered Artists in talentapp</p>
        </div>
        <label className="artists_heading_number">{Artists?.length}</label>
      </div>

      <div className="main_artists_tab_display">
        <div className="filter_artists_export">
          <h2>Export Artists Data</h2>
          <div className="main_filter">
            <Select
              options={category_options}
              placeholder="Category"
              onChange={(e) => {
                e?.name && setfilters({ ...filters, [e.name]: e.value });
              }}
            />
            <Select
              options={subcategory_options.filter(
                (item) => item.target === filters?.category
              )}
              placeholder="Sub Category"
              isDisabled={!filters?.category && true}
              onChange={(e) => {
                e?.name && setfilters({ ...filters, [e.name]: e.value });
              }}
              ref={subcategory_ref}
            />
            <Select
              options={export_options}
              placeholder="Export To"
              onChange={(e) => {
                setexportto(e.value);
              }}
            />
            <button onClick={ExportData}>Export</button>
          </div>
        </div>
        <div className="all_artists_table">
          <div className="artists_table_heading">
            <h2>SNO</h2>
            <h2>Name</h2>
            <h2>Category</h2>
            <h2>Sub Category</h2>
          </div>
          <div className="artists_table_body">
            {Filteredartists
              ? Filteredartists?.map((item, index) => {
                  return (
                    <>
                      <h2>{index + 1}</h2>
                      <h2>{item?.name + ' ' + item?.surname}</h2>
                      <h2>{item?.category}</h2>
                      <h2>{item?.subcategory}</h2>
                    </>
                  );
                })
              : Artists?.map((item, index) => {
                  return (
                    <>
                      <h2>{index + 1}</h2>
                      <h2>{item?.name + ' ' + item?.surname}</h2>
                      <h2>{item?.category}</h2>
                      <h2>{item?.subcategory}</h2>
                    </>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}
