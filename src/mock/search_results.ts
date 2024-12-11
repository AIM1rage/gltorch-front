import { SearchResult } from "@/types/search_result";

export const MOCK_SEARCH_RESULTS = [
  {
    id: "a",
    data: `package data

import (
 	"log/slog"
 	"time"
)

type Tick struct {
 	Instrument string
 	Time       time.Time
 	Price      float64
 	Volume     int64
}

func (t Tick) LogValue() slog.Value {
 	return slog.GroupValue(
		slog.String("instrument", t.Instrument),
		slog.Time("time", t.Time),
		slog.Any("price", t.Price),
		slog.Any("volume", t.Volume),
 	)
}`,
    startline: 1,
    path: "data/data.go",
    fileName: "data.go",
    project: {
      id: 101,
      path: "stratosphere",
      pathWithNamespace: "kozlov/stratosphere",
      parent: { user: { id: 1, username: "kozlov" } },
    },
  },
  {
    data: `func TicksToCandles(ticks <-chan Tick, interval time.Duration) <-chan Candle {
  candles := make(chan Candle, 1000)
  go ticksToCandles(interval, ticks, candles)
  return candles
}

func ticksToCandles(intvl time.Duration, ticks <-chan Tick, candles chan<- Candle) {
  defer close(candles)

  t, ok := <-ticks
  if !ok {
  	return
  }

  cur := Candle{
  	Instrument: t.Instrument,
  	Time:       t.Time.Truncate(intvl),
  	Open:       t.Price,
  	Close:      t.Price,
  	High:       t.Price,
  	Low:        t.Price,
  	Volume:     t.Volume,
  }

  for t := range ticks {
  	if t.Time.Truncate(intvl).Before(cur.Time) {
  		candles <- cur
  		cur = Candle{
  			Instrument: t.Instrument,
  			Time:       t.Time.Truncate(intvl),
  			Open:       t.Price,
  			Close:      t.Price,
  			High:       t.Price,
  			Low:        t.Price,
  			Volume:     t.Volume,
  		}

  		continue
  	}

  	cur.Close = t.Price
  	cur.High = max(cur.High, t.Price)
  	cur.Low = min(cur.Low, t.Price)
  	cur.Volume += t.Volume
  }

  candles <- cur
}`,
    id: 2,
    startline: 77,
    path: "data/data.go",
    fileName: "data.go",
    project: {
      id: 101,
      path: "stratosphere",
      pathWithNamespace: "kozlov/stratosphere",
      parent: { user: { id: 1, username: "kozlov" } },
    },
  },
] as SearchResult[];
