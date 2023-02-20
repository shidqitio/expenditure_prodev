exports.createHTML = (dokumen,jenishtml) =>{
    if(jenishtml === "SPPD")
    {
        //#region SPPD
        return JSON.stringify(`<html>
        <head>
          <style>
            @font-face {
              font-family: "Times";
              font-weight: normal;
              font-style: normal;
              font-variant: normal;
              /* src: url("http://eclecticgeek.com/dompdf/fonts/Elegance.ttf") format("truetype"); */
            }
      
            body {
              font-family: "Times", "sans-serif";
            }
          </style>
          <style>
            @page {
              margin-top: 0px;
              margin-bottom: 260px;
              margin-left: 55px;
              margin-right: 55px;
            }
      
            header {
              position: fixed;
              top: -179px;
              left: 0px;
              right: 0px;
              /* background-color: lightblue; */
              height: 160px;
            }
      
            footer {
              width: 100%;
              text-align: center;
              bottom: -120px;
            }
      
            .sign {
              position: absolute;
              bottom: 0px;
              height: 0cm;
              left: -55px;
              right: -55px;
              font-family: "Arial", "sans-serif";
            }
      
            .barcode {
              position: fixed;
              bottom: -150px;
              height: 0cm;
              left: -55px;
              right: 0px;
              text-align: left;
            }
      
            p {
              page-break-after: always;
            }
      
            p:last-child {
              page-break-after: never;
            }
          </style>
        </head>
        <body>
          <main>
            <br />
            <table style="padding: 0px 0px 0px 0px; font-size: 10pt" width="100%">
              <tr>
                <td align="left" style="">
                  KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI <br />
                  UNIVERSITAS TERBUKA <br />
                  TANGERANG
               </td> 
                </td>
              </tr>
            </table>
            <br />
            <br />
            <table style="padding: 0px 0px 0px 0px; font-size: 10pt" width="100%">
              <tr>
                <td align="center" style="">
                  <b> SURAT PERJALANAN DINAS </b>
               </td> 
                </td>
              </tr>
            </table>
            <table
              width="100%"
              class="table table-bordered"
              style="
                padding: 5px 5px 5px 5px;
                font-size: 10pt;
                border-collapse: collapse;
                border: 1px solid black;
              "
            >
              <tbody>
                  <tr>
                      <td
                        style="
                          width: 3%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                        align="center"
                      >
                        1
                      </td>
                      <td
                        style="
                          width: 50%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                      >
                         Pejabat berwenang yang memberi perintah
                      </td>
                      <td
                        style="
                          width: 47%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                      >
                        PPK Kegiatan ${dokumen.nama_unit}
                      </th>
                    </tr>
                  
                    <tr>
                      <td
                        style="
                          width: 3%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                        align="center"
                      >
                        2
                      </td>
                      <td
                        style="
                          width: 50%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                      >
                        Nama pegawai yang diperintahkan
                      </td>
                      <td
                        style="
                          width: 47%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                      >
                        ${dokumen.nama_petugas}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          width: 3%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                        align="center"
                      >
                        3
                      </td>
                      <td
                        style="
                          width: 50%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                      >
                         a. Pangkat dan Golongan <br />
                         b. Jabatan <br />
                         c. Gaji Pokok <br />
                         d. Tingkat menurut peraturan perjalanan
                      </td>
                      <td
                        style="
                          width: 47%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
      
                      >
                      a. ${dokumen.gol} <br />
                      b. - <br />
                      c. - <br />
                      d. -
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          width: 3%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                        align="center"
                      >
                        4
                      </td>
                      <td
                        style="
                          width: 50%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                      >
                      Maksud Perjalanan Dinas
                      </td>
                      <td
                        style="
                          width: 47%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
      
                      >
                       ${dokumen.uraiankegiatan}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          width: 3%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                        align="center"
                      >
                        5
                      </td>
                      <td
                        style="
                          width: 50%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                      >
                       Alat angkutan yang dipergunakan
                      </td>
                      <td
                        style="
                          width: 47%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
      
                      >
                      ${dokumen.jenis_transport}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          width: 3%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                        align="center"
                      >
                        6
                      </td>
                      <td
                        style="
                          width: 50%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                      >
                       a. Tempat Berangkat <br/>
                       b. Tempat Tujuan
                      </td>
                      <td
                        style="
                          width: 47%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
      
                      >
                      a. ${dokumen.tempat_asal} <br/>
                       b. ${dokumen.tempat_tujuan}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          width: 3%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                        align="center"
                      >
                        7
                      </td>
                      <td
                        style="
                          width: 50%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
                      >
                       a. Lamanya perjalanan dinas <br/>
                       b. Tanggal berangkat <br> 
                       c. Tanggal harus kembali 
                      </td>
                      <td
                        style="
                          width: 47%;
                          border-collapse: collapse;
                          border: 1px solid black;
                        "
      
                      >
                      a. ${dokumen.jumlah_hari} Hari <br/>
                       b. ${dokumen.tanggal_berangkat} <br>
                       c. ${dokumen.tanggal_kembali}
                      </td>
                    </tr>
                    
              </tbody>
      
            </table>
          </main>
        </body>
      </html>`)
      //#endregion SPPD
    }
}