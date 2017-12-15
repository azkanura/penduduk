        populateData (penduduk, [], arrayProvince, selectProvince, 'province');

        selectProvince.on('change',function(){
            var selectedProvince = $(this).val();
            var arrayClause = [
                {title:'provinsi',value:selectedProvince}
            ];

            populateData(penduduk,arrayClause,arrayCity, selectCity, 'city');
        });

        selectCity.on('change',function(){
            var selectedProvince = selectProvince.val();
            var selectedCity = $(this).val();
            var arrayClause = [
                {title:'provinsi',value:selectedProvince},
                {title:'kota',value:selectedCity}
            ];
            populateData(penduduk,arrayClause,arrayDistrict, selectDistrict, 'district');
        });

        selectDistrict.on('change',function(){
            var selectedProvince = selectProvince.val();
            var selectedCity = selectCity.val();
            var selectedDistrict = $(this).val();
            var arrayClause = [
                {title:'provinsi',value:selectedProvince},
                {title:'kota',value:selectedCity},
                {title:'kecamatan',value:selectedDistrict}
            ];
            populateData(penduduk,arrayClause,arraySubdistrict, selectSubdistrict, 'subdistrict');
        });

        selectSubdistrict.on('change',function(){
            var selectedProvince = selectProvince.val();
            var selectedCity = selectCity.val();
            var selectedDistrict = selectDistrict.val();
            var selectedSubdistrict = $(this).val();
            var arrayClause = [
                {title:'provinsi',value:selectedProvince},
                {title:'kota',value:selectedCity},
                {title:'kecamatan',value:selectedDistrict},
                {title:'kelurahan',value:selectedSubdistrict}
            ];
            populateData(penduduk,arrayClause,arrayRW, selectRW, 'rw');
        });

        selectRW.on('change',function(){
            var selectedProvince = selectProvince.val();
            var selectedCity = selectCity.val();
            var selectedDistrict = selectDistrict.val();
            var selectedSubdistrict = selectSubdistrict.val();
            var selectedRW = $(this).val();
            var arrayClause = [
                {title:'provinsi',value:selectedProvince},
                {title:'kota',value:selectedCity},
                {title:'kecamatan',value:selectedDistrict},
                {title:'kelurahan',value:selectedSubdistrict}
                {title:'rw',value:selectedRW}
            ];
            populateData(penduduk,arrayClause,arrayRT, selectRT, 'rt');
        });


        function whereClause(doc,array){
            if(array.length){
                array.forEach((data)=>{
                    doc = doc.where(data.title,'==',data.name);
                });
            }
            return doc;
        }

        function PopulateData (doc, arrayClause, arrayData, selectData, typeData){
            whereClause(doc,arrayClause).get().then((querySnapshot)=>{
                arrayData = [];
                querySnapshot.forEach((d)=>{
                    if(d && d.exists){
                        var data = d.data();
                        var name ;
                        switch(typeData){
                            case 'province':
                                name = data.provinsi;
                                break;
                            case 'city':
                                name = data.kota;
                                break;
                            case 'district':
                                name = data.kecamatan;
                                break;
                            case 'subdistrict':
                                name = data.kelurahan;
                                break;
                            case 'rw':
                                name = data.rw;
                                break;
                            case 'rt':
                                name = data.rt;
                                break;
                        }
                        var exist = exists(name,arrayData);
                        if(!exist){
                            arrayData.push(name);
                        }
                    }
                });

                selectData.html('');
                arrayData.forEach((data)=>{
                    selectData.append('<option value="'+data+'">'+data+'</option>');
                });
            });
        }


        selectCity.on('change',function(){
            var selectedCity = $(this).val();

            penduduk.where('provinsi','==',selectedCity).get().then((querySnapshot)=>{
                arrayDistrict = [];
                querySnapshot.forEach((doc)=>{
                    if(doc && doc.exists){
                        var data = doc.data();
                        var name = data.kota;
                        var exist = exists(name,arrayDistrict);
                        if(!exist){
                            arrayDistrict.push(name);
                        }
                    }
                });

                selectDistrict.html('');
                arrayDistrict.forEach((data)=>{
                    selectDistrict.append('<option value="'+data+'">'+data+'</option>');
                });
            });

        });

        selectDistrict.on('change',function(){
            var selectedDistrict = $(this).val();

            penduduk.where('provinsi','==',selectedDistrict).get().then((querySnapshot)=>{
                arraySubdistrict = [];
                querySnapshot.forEach((doc)=>{
                    if(doc && doc.exists){
                        var data = doc.data();
                        var name = data.kota;
                        var exist = exists(name,arraySubdistrict);
                        if(!exist){
                            arraySubdistrict.push(name);
                        }
                    }
                });

                selectSubdistrict.html('');
                arraySubdistrict.forEach((data)=>{
                    selectSubdistrict.append('<option value="'+data+'">'+data+'</option>');
                });
            });

        });

        selectSubdistrict.on('change',function(){
            var selectedSubdistrict = $(this).val();

            penduduk.where('provinsi','==',selectedSubdistrict).get().then((querySnapshot)=>{
                arrayRW = [];
                querySnapshot.forEach((doc)=>{
                    if(doc && doc.exists){
                        var data = doc.data();
                        var name = data.kota;
                        var exist = exists(name,arrayRW);
                        if(!exist){
                            arrayRW.push(name);
                        }
                    }
                });

                selectRW.html('');
                arrayRW.forEach((data)=>{
                    selectRW.append('<option value="'+data+'">'+data+'</option>');
                });
            });

        });


        selectRW.on('change',function(){
            var selectedRW = $(this).val();

            penduduk.where('provinsi','==',selectedRW).get().then((querySnapshot)=>{
                arrayRT = [];
                querySnapshot.forEach((doc)=>{
                    if(doc && doc.exists){
                        var data = doc.data();
                        var name = data.kota;
                        var exist = exists(name,arrayRT);
                        if(!exist){
                            arrayRT.push(name);
                        }
                    }
                });

                selectRT.html('');
                arrayRT.forEach((data)=>{
                    selectRT.append('<option value="'+data+'">'+data+'</option>');
                });
            });

        });


    