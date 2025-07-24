import * as XLSX from 'xlsx'

export function useDownloadList() {
  async function downloadList(list_id: number) {
    try {
      const response = await useApi().get(`list/${list_id}/content`)

      if (response.success === true && response.data) {
        const { list_name, list_header, list_data } = response.data

        if (!list_data || list_data.length === 0) {
          showToast({
            message: 'No data available to download',
            type: 'warning',
          })
          return
        }

        // Transform the data to use proper headers instead of option_1, option_2, etc.
        const transformedData = list_data.map((item: any) => {
          const transformedRow: any = {}

          // Map option_1, option_2, etc. to actual header names
          list_header.forEach((header: string, index: number) => {
            const optionKey = `option_${index + 1}`
            transformedRow[header] = item[optionKey] || ''
          })

          return transformedRow
        })

        // Create worksheet from transformed data
        const worksheet = XLSX.utils.json_to_sheet(transformedData)

        // Auto-size columns for better readability
        const range = XLSX.utils.decode_range(worksheet['!ref']!)
        const columnWidths: any[] = []

        // Calculate column widths based on content
        for (let col = range.s.c; col <= range.e.c; col++) {
          let maxWidth = 10 // minimum width

          // Check header width
          const headerCell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: col })]
          if (headerCell && headerCell.v) {
            maxWidth = Math.max(maxWidth, headerCell.v.toString().length)
          }

          // Check data cells width
          for (let row = range.s.r + 1; row <= range.e.r; row++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })]
            if (cell && cell.v) {
              maxWidth = Math.max(maxWidth, cell.v.toString().length)
            }
          }

          columnWidths.push({ wch: Math.min(maxWidth + 2, 50) }) // Max width of 50
        }

        worksheet['!cols'] = columnWidths

        // Create workbook
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads')

        // Generate filename using list_name from response
        const timestamp = new Date().toISOString().slice(0, 10)
        const sanitizedListName = list_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        const filename = `${sanitizedListName}_${timestamp}.xlsx`

        // Write file
        XLSX.writeFile(workbook, filename)

        showToast({
          message: response.message,
          type: 'success',
        })
      }
      else {
        showToast({
          message: response.message,
          type: 'error',
        })
      }
    }
    catch (error: any) {
      showToast({
        message: `${error.message}`,
        type: 'error',
      })
    }
  }

  return downloadList
}
