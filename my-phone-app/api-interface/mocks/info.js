/**
 * 资讯
 *
 * @url /info
 *
 */

module.exports = function (req) {
  return {
    'code': 0,
    'data|10': [{
      'info_title': '@ctitle',
      'info_text': '@cparagraph',
      'img': '@image',
      'date': '@date'
    }]
  }
}
