import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosinstance } from '../../utils/axiosinstance';
import Artist from '../Artist/Artist';
import ArtistFilter from '../ArtistFilter/ArtistFilter';
import Pagination from '../Pagination/Pagination';
import './mainartist.scss';

export default function MainArtist() {
  const User = useSelector((state) => state.admin.admin);
  const [items, setItems] = useState();
  const [filters, setfilters] = useState();
  const [permissions, setpermissions] = useState();
  const [FilteredItems, setFilteredItems] = useState();
  const [itemsperpage] = useState(12);
  const [currentpage, setcurrentpage] = useState(1);

  const GetAge = (item) => {
    const dateofbirth = new Date(item?.dateofbirth);
    const today = new Date();
    const ageyear = dateofbirth.getFullYear();
    const currentyear = today.getFullYear();
    const age = currentyear - ageyear;
    return age;
  };

  useEffect(() => {
    const FilterArtists = () => {
      const filtereditems = items?.filter((item) => {
        let languageentry = item['knownlanguages'];

        const FulName = item?.name.concat(item?.surname).toLowerCase();
        const itemsage = GetAge(item);
        if (FulName?.includes(filters?.search)) {
          return item;
        } else if (filters?.age === 'kids' && itemsage < 12) {
          return item;
        } else if (
          filters?.age === 'teengaers' &&
          itemsage < 19 &&
          itemsage > 12
        ) {
          return item;
        } else if (filters?.age === 'above 20' && itemsage > 19) {
          return item;
        } else if (
          Object.entries(filters).every(([key, value]) => item[key] === value)
        ) {
          return item;
        } else if (
          languageentry?.some((item) => item?.value === filters?.motherlanguage)
        ) {
          return items;
        }
      });
      setFilteredItems(filtereditems);
    };
    filters && FilterArtists();
  }, [filters]);

  const GetFilters = (fil) => {
    setfilters(fil);
  };

  useEffect(() => {
    const getAssistantsPermissions = async () => {
      try {
        const res = await axiosinstance.get(
          `/assistant/permissions/${User?._id}`
        );
        setpermissions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    (User?.role === 3 || User?.role === 4) && getAssistantsPermissions();
  }, [User?._id]);

  useEffect(() => {
    const GetAllArtists = async () => {
      try {
        const res =
          User?.role === 1 || User?.role === 2 || User?.role === 3
            ? await axiosinstance.get('/user/all')
            : permissions &&
              (await axiosinstance.post(`/user/bulk`, { bulk: permissions }));
        setItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetAllArtists();
  }, [permissions]);

  const onChangePage = (index) => {
    setcurrentpage(index);
  };

  const IndexoflastItem = currentpage * itemsperpage;
  const IndexoffirstItem = IndexoflastItem - itemsperpage;
  const currentitems = filters
    ? FilteredItems?.slice(IndexoffirstItem, IndexoflastItem)
    : items?.slice(IndexoffirstItem, IndexoflastItem);

  return (
    <>
      <ArtistFilter GetFilters={GetFilters} />
      <div className="container">
        <div className="inner_container">
          <div className="main_artist_heading">
            <h2>
              Total Artists{' '}
              <span>( {filters ? FilteredItems?.length : items?.length} )</span>
            </h2>
          </div>
          <div className="main_artists_grid">
            {currentitems?.map((item, index) => {
              return <Artist item={item} key={index} />;
            })}
          </div>
          <Pagination
            itemsperpage={itemsperpage}
            totalitems={filters ? FilteredItems : items}
            currentpage={currentpage}
            onChangePage={onChangePage}
          />
        </div>
      </div>
    </>
  );
}
